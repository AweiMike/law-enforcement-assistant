const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleUnlicensed(context) {
    const payload = context.event.payload;

    // Step 1: Select Vehicle Type
    if (payload === 'module=unlicensed') {
        await context.replyFlex(
            '無照駕駛 - 選擇車種',
            createSelection('無照駕駛 - 車種', '請選擇攔查車種', [
                { label: '🛵 機車', data: 'unlicensed_moto' },
                { label: '🚗 小型車', data: 'unlicensed_small' },
                { label: '🚚 大型車 (聯結/大客/大貨)', data: 'unlicensed_big' },
            ])
        );
        return;
    }

    // Step 2: Select History (Recidivism)
    if (['unlicensed_moto', 'unlicensed_small', 'unlicensed_big'].includes(payload)) {
        const typeMap = {
            'unlicensed_moto': '機車',
            'unlicensed_small': '小型車',
            'unlicensed_big': '大型車',
        };
        const typeLabel = typeMap[payload];

        await context.replyFlex(
            '無照駕駛 - 違規紀錄',
            createSelection(`無照駕駛 (${typeLabel})`, '查詢 10年內 違規紀錄', [
                { label: '1️⃣ 初犯', data: `${payload}_1` },
                { label: '2️⃣ 10年內第 2 次', data: `${payload}_2` },
                { label: '3️⃣ 10年內第 3 次以上', data: `${payload}_3` },
            ])
        );
        return;
    }

    // Step 3: Result
    if (payload.startsWith('unlicensed_') && payload.split('_').length === 3) {
        const [_, type, history] = payload.split('_');

        let fineRange = '';
        let violationDetails = '';

        // Logic for Fines
        if (type === 'moto') {
            violationDetails = '機車無照駕駛 (第21條)';
            if (history === '1') fineRange = '18,000 ~ 36,000 元';
            else if (history === '2') fineRange = '36,000 元';
            else fineRange = '每次加罰 12,000 元 (無上限)';
        } else if (type === 'small') {
            violationDetails = '小型車無照駕駛 (第21條)';
            if (history === '1') fineRange = '36,000 ~ 60,000 元';
            else if (history === '2') fineRange = '60,000 元';
            else fineRange = '每次加罰 12,000 元 (無上限)';
        } else if (type === 'big') {
            violationDetails = '大型車無照駕駛 (第21-1條)';
            if (history === '1') fineRange = '40,000 ~ 80,000 元';
            else if (history === '2') fineRange = '80,000 元';
            else fineRange = '每次加罰 24,000 元 (無上限)';
        }

        const sopSteps = [
            '當場移置保管車輛 (叫拖吊車)',
            '當場拆卸扣繳牌照 (代保管牌照)',
            '舉發車主連坐處罰 (同額罰鍰 + 吊扣牌照)',
            '駕駛人禁考 (1~2年)'
        ];

        let warnings = '115/1/31 起無照累犯計算「重新起算」，舊紀錄不計入。';

        await context.replyFlex(
            '無照駕駛 - 執法結果',
            createResult(
                '執法結果：無照駕駛',
                violationDetails,
                fineRange,
                sopSteps,
                warnings
            )
        );
    }
};
