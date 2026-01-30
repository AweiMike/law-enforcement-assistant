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
        let article = {};
        let additionalCitations = [];

        // Logic for results with complete article references
        if (type === 'moto') {
            article = {
                code: '21條1項1款',
                description: '未領有駕駛執照駕駛小型車或機車'
            };
            if (history === '1') {
                fineRange = '機車駕駛人處18,000～36,000元罰鍰';
            } else if (history === '2') {
                fineRange = '機車駕駛人處36,000元罰鍰 (累犯2次)';
            } else {
                fineRange = '機車駕駛人處罰鍰 + 每次加罰12,000元 (無上限)';
            }
        } else if (type === 'small') {
            article = {
                code: '21條1項1款',
                description: '未領有駕駛執照駕駛小型車或機車'
            };
            if (history === '1') {
                fineRange = '汽車駕駛人處新臺幣36,000~60,000元罰鍰，當場移置保管車輛。';
            } else if (history === '2') {
                fineRange = '汽車駕駛人處60,000元罰鍰 (累犯2次)';
            } else {
                fineRange = '汽車駕駛人處罰鍰 + 每次加罰12,000元 (無上限)';
            }
        } else if (type === 'big') {
            article = {
                code: '21-1條1項',
                description: '未領有駕駛執照駕駛大型車輛'
            };
            if (history === '1') {
                fineRange = '駕駛人處新臺幣40,000~80,000元罰鍰，當場移置保管車輛。';
            } else if (history === '2') {
                fineRange = '駕駛人處80,000元罰鍰 (累犯2次)';
            } else {
                fineRange = '駕駛人處罰鍰 + 每次加罰24,000元 (無上限)';
            }
        }

        // Additional citations (加開)
        additionalCitations = [
            `舉發『所有人』「21條6項」：吊扣牌照，移置保管時扣繳牌照。`,
            `舉發『所有人』「21條7項」：併處罰鍰。`
        ];

        // Legal annotations
        const annotations = [
            '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）',
            '依據警署交字第1150053864號：車輛所有人或受託人到場並能即時接手駕駛，得准予當場領回。',
            '不聽制止或不服稽查，另舉發60條3項。'
        ];

        let warnings = '115/1/31 起無照累犯計算「重新起算」，舊紀錄不計入。';

        await context.replyFlex(
            '無照駕駛 - 執法結果',
            createResult(
                '駕照違規速查',
                article,
                fineRange,
                additionalCitations,
                annotations,
                warnings
            )
        );
    }
};
