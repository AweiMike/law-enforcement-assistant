const { createSelection, createResult } = require('../utils/flex');
const { lookupViolation, getFineAmount, getFineType } = require('../data/violation-matrix');

/**
 * 取得車種標籤
 */
function getVehicleLabel(id) {
    const labels = {
        light_moto: '輕型機車',
        heavy_moto: '普通重型機車',
        super_moto: '大型重型機車',
        small_car: '小型車',
        truck: '大貨車',
        bus: '大客車',
        trailer: '聯結車',
        tractor: '曳引車',
    };
    return labels[id] || id;
}

/**
 * 取得汽車駕照狀態標籤
 */
function getCarLicenseLabel(id) {
    const labels = {
        none: '未曾考領汽車駕照',
        suspended: '汽車駕照吊扣',
        revoked: '汽車駕照吊/註銷',
        small: '小型車駕照',
        truck: '大貨車駕照',
        bus: '大客車駕照',
        trailer: '聯結車駕照',
    };
    return labels[id] || id;
}

/**
 * 取得機車駕照狀態標籤
 */
function getMotoLicenseLabel(id) {
    const labels = {
        none: '未曾考領機車駕照',
        suspended: '機車駕照吊扣',
        revoked: '機車駕照吊/註銷',
        light: '輕型機車駕照',
        heavy: '普通重型機車駕照',
        super: '大型重型機車駕照',
    };
    return labels[id] || id;
}

/**
 * 建立已選條件摘要
 */
function buildSummary(state) {
    const parts = [];
    if (state.vehicleType) {
        parts.push(`🚗 車種：${getVehicleLabel(state.vehicleType)}`);
    }
    if (state.carLicense) {
        parts.push(`🪪 汽車駕照：${getCarLicenseLabel(state.carLicense)}`);
    }
    if (state.motoLicense) {
        parts.push(`🏍️ 機車駕照：${getMotoLicenseLabel(state.motoLicense)}`);
    }
    if (state.isOwner !== null && state.isOwner !== undefined) {
        parts.push(`👤 車主：${state.isOwner ? '同為車主' : '非車主'}`);
    }
    return parts.length > 0 ? parts.join('\n') : null;
}

/**
 * 法條註釋/函釋依據
 */
const LEGAL_ANNOTATIONS = {
    referenceTable: '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）',
    policeDirective: '依據警署交字第1150053864號：車輛所有人或受託人到場並能即時接手駕駛，得准予當場領回。',
    roadSupervision_21_3: '依據路監交字第1130062780號函(二)：第21條3項、第21-1條3項所稱「吊銷駕駛執照期間」，駕駛執照吊銷後未重新考領者均適用之。',
    disobey: '不聽制止或不服稽查，另舉發60條3項。',
    safetyRule61: '依據安全規則61條：持照可駕駛車種對照。',
    newLawDate: '新法施行日期：115年1月31日起，無照累犯計算「重新起算」。',
};

/**
 * 取得應加開的條款
 */
function getAdditionalCitations(isOwner, article, vehicleType) {
    const isLargeCar = ['truck', 'bus', 'trailer', 'tractor'].includes(vehicleType);
    const fineType = getFineType(article);
    const citations = [];

    // 22條較輕違規 - 只禁止駕駛
    if (fineType === 'light') {
        citations.push('禁止其駕駛');
        return citations;
    }

    // 21條/21-1條 - 移置保管 + 吊扣牌照
    citations.push('當場移置保管車輛 (禁止其駕駛)');

    if (isOwner) {
        if (isLargeCar) {
            citations.push(`舉發「21-1條6項」：吊扣牌照，移置保管時扣繳牌照`);
        } else {
            citations.push(`舉發「21條6項」：吊扣牌照，移置保管時扣繳牌照`);
        }
    } else {
        if (isLargeCar) {
            citations.push(`舉發『所有人』「21-1條6項」：吊扣牌照，移置保管時扣繳牌照`);
            citations.push(`舉發『所有人』「21-1條7項」：併處罰鍰`);
        } else {
            citations.push(`舉發『所有人』「21條6項」：吊扣牌照，移置保管時扣繳牌照`);
            citations.push(`舉發『所有人』「21條7項」：併處罰鍰`);
        }
    }

    return citations;
}

/**
 * 無照駕駛模組 - 完整版
 * 使用官方對照表 (114年11月6日修正)
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
            createSelection('駕照違規速查 (1/5)', '請選擇駕駛車種', [
                { label: '🛵 輕型機車', data: 'ul_v_light_moto' },
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
        const newState = { ...current, vehicleType, step: 2 };
        context.setState({ unlicensed: newState });

        const summary = buildSummary(newState);

        await context.replyFlex(
            '駕照違規速查 - 汽車駕照狀態',
            createSelection('汽車駕照狀態 (2/5)', `${summary}\n\n請選擇駕駛人的汽車駕照狀態`, [
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
        const newState = { ...current, carLicense, step: 3 };
        context.setState({ unlicensed: newState });

        const summary = buildSummary(newState);

        await context.replyFlex(
            '駕照違規速查 - 機車駕照狀態',
            createSelection('機車駕照狀態 (3/5)', `${summary}\n\n請選擇駕駛人的機車駕照狀態`, [
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
        const newState = { ...current, motoLicense, step: 4 };
        context.setState({ unlicensed: newState });

        const summary = buildSummary(newState);

        await context.replyFlex(
            '駕照違規速查 - 是否同為車主',
            createSelection('是否同為車主 (4/5)', `${summary}\n\n駕駛人是否同時為車輛所有人？`, [
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
        const newState = { ...current, isOwner, step: 5 };
        context.setState({ unlicensed: newState });

        const summary = buildSummary(newState);

        await context.replyFlex(
            '駕照違規速查 - 是否再犯',
            createSelection('是否再犯 (5/5)', `${summary}\n\n請選擇駕駛人的違規紀錄`, [
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

        const { vehicleType, carLicense, motoLicense, isOwner } = state;

        // 使用對照表查詢違規結果
        const result = lookupViolation(carLicense, motoLicense, vehicleType);

        if (result.legal) {
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
                    null,
                    buildSummary(state)
                )
            );

            context.setState({ unlicensed: null });
            return;
        }

        // 違規駕駛
        const article = {
            code: result.article,
            description: result.desc,
        };

        const fineType = getFineType(result.article);
        const fineInfo = getFineAmount(result.article, vehicleType, recidivism);
        const citations = getAdditionalCitations(isOwner, result.article, vehicleType);

        // 根據違規類型決定註釋
        const annotations = [LEGAL_ANNOTATIONS.referenceTable];

        if (fineType !== 'light') {
            annotations.push(LEGAL_ANNOTATIONS.policeDirective);

            if (carLicense === 'revoked' || motoLicense === 'revoked' || recidivism === 'dui_period') {
                annotations.push(LEGAL_ANNOTATIONS.roadSupervision_21_3);
            }

            annotations.push(LEGAL_ANNOTATIONS.disobey);
        } else {
            annotations.push(LEGAL_ANNOTATIONS.safetyRule61);
        }

        // 警告訊息
        let warnings = null;
        if (fineType !== 'light') {
            warnings = LEGAL_ANNOTATIONS.newLawDate;
            if (recidivism === 'dui_period' || recidivism === 'both') {
                warnings = '酒駕吊扣銷期間駕車，依21條1項2款處罰。' + warnings;
            }
        }

        await context.replyFlex(
            '駕照違規速查 - 結果',
            createResult(
                '駕照違規速查',
                article,
                fineInfo.text,
                citations,
                annotations,
                warnings,
                buildSummary(state)
            )
        );

        context.setState({ unlicensed: null });
    }
};
