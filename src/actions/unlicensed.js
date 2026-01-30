const { createSelection, createResult } = require('../utils/flex');
const {
    VEHICLE_TYPES,
    CAR_LICENSE_STATUS,
    MOTO_LICENSE_STATUS,
    LEGAL_ANNOTATIONS,
    checkDrivingLegality,
    getFineAmount,
    getAdditionalCitations,
} = require('../data/license-rules');

/**
 * 無照駕駛模組 - 完整版
 * 支援多步驟選擇流程
 */
module.exports = async function HandleUnlicensed(context) {
    const payload = context.event.payload;

    // 初始化 state
    if (!context.state.unlicensed) {
        context.setState({
            unlicensed: {
                vehicleType: null,
                carLicense: null,
                motoLicense: null,
                isOwner: null,
                recidivism: null,
                step: 0,
            },
        });
    }

    // ========== Step 0: 進入模組 ==========
    if (payload === 'module=unlicensed') {
        context.setState({
            unlicensed: { vehicleType: null, carLicense: null, motoLicense: null, isOwner: null, recidivism: null, step: 1 },
        });

        await context.replyFlex(
            '駕照違規速查 - 選擇車種',
            createSelection('駕照違規速查', '請選擇駕駛車種', [
                { label: '🏍️ 輕型機車', data: 'ul_v_light_moto' },
                { label: '🏍️ 普通重型機車', data: 'ul_v_heavy_moto' },
                { label: '🏍️ 大型重型機車', data: 'ul_v_super_moto' },
                { label: '🚗 小型車', data: 'ul_v_small_car' },
                { label: '🚚 大貨車', data: 'ul_v_truck' },
                { label: '🚌 大客車', data: 'ul_v_bus' },
                { label: '🚛 聯結車', data: 'ul_v_trailer' },
                { label: '🚜 曳引車', data: 'ul_v_tractor' },
            ])
        );
        return;
    }

    // ========== Step 1: 選擇車種 → 詢問汽車駕照狀態 ==========
    if (payload.startsWith('ul_v_')) {
        const vehicleType = payload.replace('ul_v_', '');
        const current = context.state.unlicensed || {};
        context.setState({
            unlicensed: { ...current, vehicleType, step: 2 },
        });

        await context.replyFlex(
            '駕照違規速查 - 汽車駕照狀態',
            createSelection('汽車駕照狀態', '請選擇駕駛人的汽車駕照狀態', [
                { label: '❌ 未曾考領汽車駕照', data: 'ul_c_none' },
                { label: '⏸️ 汽車駕照吊扣', data: 'ul_c_suspended' },
                { label: '🚫 汽車駕照吊/註銷', data: 'ul_c_revoked' },
                { label: '🚗 小型車駕照', data: 'ul_c_small' },
                { label: '🚚 大貨車駕照', data: 'ul_c_truck' },
                { label: '🚌 大客車駕照', data: 'ul_c_bus' },
                { label: '🚛 聯結車駕照', data: 'ul_c_trailer' },
            ])
        );
        return;
    }

    // ========== Step 2: 選擇汽車駕照 → 詢問機車駕照狀態 ==========
    if (payload.startsWith('ul_c_')) {
        const carLicense = payload.replace('ul_c_', '');
        const current = context.state.unlicensed || {};
        context.setState({
            unlicensed: { ...current, carLicense, step: 3 },
        });

        await context.replyFlex(
            '駕照違規速查 - 機車駕照狀態',
            createSelection('機車駕照狀態', '請選擇駕駛人的機車駕照狀態', [
                { label: '❌ 未曾考領機車駕照', data: 'ul_m_none' },
                { label: '⏸️ 機車駕照吊扣', data: 'ul_m_suspended' },
                { label: '🚫 機車駕照吊/註銷', data: 'ul_m_revoked' },
                { label: '🛵 輕型機車', data: 'ul_m_light' },
                { label: '🏍️ 普通重型機車', data: 'ul_m_heavy' },
                { label: '🏍️ 大型重型機車', data: 'ul_m_super' },
            ])
        );
        return;
    }

    // ========== Step 3: 選擇機車駕照 → 詢問是否同為車主 ==========
    if (payload.startsWith('ul_m_')) {
        const motoLicense = payload.replace('ul_m_', '');
        const current = context.state.unlicensed || {};
        context.setState({
            unlicensed: { ...current, motoLicense, step: 4 },
        });

        await context.replyFlex(
            '駕照違規速查 - 是否同為車主',
            createSelection('是否同為車主', '駕駛人是否同時為車輛所有人？', [
                { label: '⭕ 駕駛同為車主', data: 'ul_o_yes' },
                { label: '❌ 駕駛並非車主', data: 'ul_o_no' },
            ])
        );
        return;
    }

    // ========== Step 4: 選擇車主狀態 → 詢問是否再犯 ==========
    if (payload.startsWith('ul_o_')) {
        const isOwner = payload.replace('ul_o_', '') === 'yes';
        const current = context.state.unlicensed || {};
        context.setState({
            unlicensed: { ...current, isOwner, step: 5 },
        });

        await context.replyFlex(
            '駕照違規速查 - 是否再犯',
            createSelection('是否再犯', '請選擇駕駛人的違規紀錄', [
                { label: '✅ 否 (初犯)', data: 'ul_r_none' },
                { label: '🔄 十年內再犯', data: 'ul_r_within10y' },
                { label: '🍺 酒駕吊扣銷期間', data: 'ul_r_dui_period' },
                { label: '⚠️ 以上皆是', data: 'ul_r_both' },
            ])
        );
        return;
    }

    // ========== Step 5: 選擇再犯狀態 → 計算結果 ==========
    if (payload.startsWith('ul_r_')) {
        const recidivism = payload.replace('ul_r_', '');
        const current = context.state.unlicensed || {};
        const state = { ...current, recidivism, step: 6 };
        context.setState({ unlicensed: state });

        // 計算違規結果
        const { vehicleType, carLicense, motoLicense, isOwner } = state;

        // 檢查合法性
        const legality = checkDrivingLegality(vehicleType, carLicense, motoLicense);

        if (legality.legal) {
            // 合法駕駛
            const article = {
                code: '✅ 合法',
                description: '該駕駛人持有之駕照可合法駕駛該車種',
            };

            await context.replyFlex(
                '駕照違規速查 - 結果',
                createResult(
                    '駕照違規速查',
                    article,
                    '無需舉發',
                    ['確認駕駛人身分及駕照狀態', '依據安全規則第61條，該駕照可駕駛此車種'],
                    [LEGAL_ANNOTATIONS.referenceTable, LEGAL_ANNOTATIONS.safetyRule61],
                    null
                )
            );

            // 清除 state
            context.setState({ unlicensed: null });
            return;
        }

        // 違規駕駛
        const fineInfo = getFineAmount(vehicleType, recidivism);
        const citations = getAdditionalCitations(isOwner, legality.violation, vehicleType);

        // 取得車種中文名稱
        const vehicleLabel = Object.values(VEHICLE_TYPES).find(v => v.id === vehicleType)?.label || vehicleType;

        const article = {
            code: legality.article,
            description: `${legality.violation}駕駛${vehicleLabel}`,
        };

        // 法條依據/註釋 - 根據違規類型動態調整
        const annotations = [
            LEGAL_ANNOTATIONS.referenceTable,
            LEGAL_ANNOTATIONS.policeDirective,
        ];

        // 如果是吊銷後駕車，加入路監交字的解釋
        if (carLicense === 'revoked' || motoLicense === 'revoked' || recidivism === 'dui_period') {
            annotations.push(LEGAL_ANNOTATIONS.roadSupervision_21_3);
        }

        annotations.push(LEGAL_ANNOTATIONS.disobey);

        // 警告訊息
        let warnings = LEGAL_ANNOTATIONS.newLawDate;

        if (recidivism === 'dui_period' || recidivism === 'both') {
            warnings = '酒駕吊扣銷期間駕車，依21條1項2款處罰。' + warnings;
        }

        await context.replyFlex(
            '駕照違規速查 - 結果',
            createResult(
                '駕照違規速查',
                article,
                fineInfo.text,
                citations,
                annotations,
                warnings
            )
        );

        // 清除 state
        context.setState({ unlicensed: null });
    }
};
