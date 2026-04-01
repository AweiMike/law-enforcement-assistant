const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleDrunk(context) {
    const payload = context.event.payload;

    // Step 1: Select Type
    if (payload === 'module=drunk') {
        await context.replyFlex(
            '酒後駕車 - 違規態樣',
            createSelection('酒後駕車 (第35條)', '請選擇違規情形', [
                { label: '🍺 酒測超標 / 毒駕', data: 'drunk_over' },
                { label: '🙅 拒絕檢測 (含消極不配合)', data: 'drunk_refusal' },
            ])
        );
        return;
    }

    // Step 2: Select Accident Status
    if (['drunk_over', 'drunk_refusal'].includes(payload)) {
        await context.replyFlex(
            '酒後駕車 - 肇事狀況',
            createSelection('酒後駕車 - 是否肇事', '請選擇肇事程度', [
                { label: '✅ 未肇事', data: `${payload}_none` },
                { label: '🤕 肇事致人受傷', data: `${payload}_injury` },
                { label: '⚰️ 肇事致人重傷或死亡', data: `${payload}_severe` },
            ])
        );
        return;
    }

    // Step 3: Result
    if (payload.startsWith('drunk_') && payload.split('_').length === 3) {
        const [_, type, accident] = payload.split('_');

        let fineText = '';
        let article = {};
        let additionalCitations = [];

        // Logic with complete article references
        if (type === 'refusal') {
            article = {
                code: '35條4項',
                description: '拒絕接受酒精濃度測試之檢定'
            };
            fineText = '處新臺幣180,000元罰鍰，吊銷駕照+終身不得考領。';
            additionalCitations = [
                `舉發「35條9項」：扣繳牌照2年。`,
                `舉發『所有人』(如非駕駛人本人)併處同額罰鍰。`
            ];
        } else {
            // 酒測超標
            if (accident === 'severe') {
                article = {
                    code: '35條3項',
                    description: '酒駕致人重傷或死亡'
                };
                fineText = '依酒精濃度/車種裁罰 + 加重，吊銷駕照+終身不得考領。';
            } else if (accident === 'injury') {
                article = {
                    code: '35條2項',
                    description: '酒駕致人受傷'
                };
                fineText = '依酒精濃度/車種裁罰，吊扣駕照2~4年。';
            } else {
                article = {
                    code: '35條1項',
                    description: '酒精濃度超過規定標準'
                };
                fineText = '依酒精濃度/車種裁罰基準表，吊扣駕照1~2年。';
            }
            additionalCitations = [
                `舉發「35條9項」：扣繳牌照2年。`,
                `舉發『所有人』(如非駕駛人本人)「35條10項」：併處同額罰鍰。`,
                `駕照遭吊註銷後未再考領者，另舉發21條3項或21-1條3項。`
            ];
        }

        // Legal annotations
        const annotations = [
            '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）',
            '依據路監交字第1130062780號函：違反35條駕照遭吊註銷後未再考領者，另舉發21條3項或21-1條3項。',
            '不聽制止或不服稽查，另舉發60條3項。',
            '🆕 第90條（115/3/31施行）：施用毒品後駕車，行為成立之日自「檢驗報告結果通知警察機關之日」起算；肇事責任不明已送鑑定者，自鑑定終結之日起算。'
        ];

        let warnings = '';
        if (type === 'refusal') {
            warnings = '拒測強制抽血程序尚未上路，仍需報請檢察官核發許可書 (舊制流程)。';
        }

        await context.replyFlex(
            '酒後駕車 - 執法結果',
            createResult(
                '酒駕違規速查',
                article,
                fineText,
                additionalCitations,
                annotations,
                warnings
            )
        );
    }
};
