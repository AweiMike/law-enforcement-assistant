const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleYield(context) {
    const payload = context.event.payload;

    // Step 1: Select Target
    if (payload === 'module=yield') {
        await context.replyFlex(
            '未禮讓/未避讓 - 對象',
            createSelection('未禮讓/未避讓', '請選擇對象', [
                { label: '🚶 行人 (第44條)', data: 'yield_pedestrian' },
                { label: '🚑 緊急車輛 (第45條)', data: 'yield_emergency' },
            ])
        );
        return;
    }

    // Step 2: Select Consequence
    if (['yield_pedestrian', 'yield_emergency'].includes(payload)) {
        await context.replyFlex(
            '未禮讓/未避讓 - 後果',
            createSelection('未禮讓/未避讓 - 後果程度', '請選擇肇事後果', [
                { label: '✅ 一般違規 (無傷亡)', data: `${payload}_none` },
                { label: '🤕 致人受傷', data: `${payload}_injury` },
                { label: '⚰️ 致人重傷或死亡', data: `${payload}_severe` },
            ])
        );
        return;
    }

    // Step 3: Result
    if (payload.startsWith('yield_') && payload.split('_').length === 3) {
        const [_, target, consequence] = payload.split('_');

        let fineText = '';
        let article = {};
        let additionalCitations = [];

        if (target === 'pedestrian') {
            if (consequence === 'none') {
                article = {
                    code: '44條2項',
                    description: '汽車行近行人穿越道，未暫停讓行人先行通過'
                };
                fineText = '處新臺幣1,200～6,000元罰鍰。';
                additionalCitations = ['依一般違規程序舉發'];
            } else if (consequence === 'injury') {
                article = {
                    code: '44條3項',
                    description: '未禮讓行人致人受傷'
                };
                fineText = '處新臺幣7,200～36,000元罰鍰，吊扣駕照1年。';
                additionalCitations = [
                    '當場舉發「44條3項」',
                    '吊扣駕照1年'
                ];
            } else {
                article = {
                    code: '44條4項',
                    description: '未禮讓行人致人重傷或死亡'
                };
                fineText = '處新臺幣36,000元罰鍰，吊銷駕照，禁考3年。';
                additionalCitations = [
                    '當場舉發「44條4項」',
                    '吊銷駕照 (禁考3年)'
                ];
            }
        } else {
            // 緊急車輛
            if (consequence === 'none') {
                article = {
                    code: '45條1項',
                    description: '聞消防車、救護車、警備車等執行緊急任務警號不立即避讓'
                };
                fineText = '處新臺幣6,000～30,000元罰鍰，吊銷駕照，吊扣牌照6個月。';
                additionalCitations = [
                    '舉發「45條1項」',
                    '吊銷駕照 (禁考1年)',
                    '吊扣牌照6個月'
                ];
            } else {
                article = {
                    code: '45條2項',
                    description: '不避讓緊急車輛致人傷亡'
                };
                fineText = '處新臺幣10,000～100,000元罰鍰，吊銷駕照，吊銷牌照。';
                additionalCitations = [
                    '舉發「45條2項」',
                    '吊銷駕照',
                    '吊銷牌照'
                ];
            }
        }

        // Legal annotations
        const annotations = [
            '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）',
            '不聽制止或不服稽查，另舉發60條3項。'
        ];

        await context.replyFlex(
            '未禮讓/未避讓 - 執法結果',
            createResult(
                '禮讓違規速查',
                article,
                fineText,
                additionalCitations,
                annotations,
                null
            )
        );
    }
};
