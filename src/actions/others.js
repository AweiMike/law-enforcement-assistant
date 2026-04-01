const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleOthers(context) {
    const payload = context.event.payload;

    // Step 1: Select Category
    if (payload === 'module=others') {
        await context.replyFlex(
            '慢車/行人違規 - 類別',
            createSelection('慢車/行人違規', '請選擇類別', [
                { label: '🚲 微型電動二輪車 (72條)', data: 'others_ebike' },
                { label: '🚶 行人違規 (78、80條)', data: 'others_pedestrian' },
            ])
        );
        return;
    }

    // Step 2: Result
    if (payload.startsWith('others_')) {
        const type = payload.split('_')[1];

        if (type === 'ebike') {
            const article = {
                code: '72條2項',
                description: '微型電動二輪車擅自變更電子控制裝置'
            };
            const fineText = '處新臺幣3,600～7,200元罰鍰。';
            const additionalCitations = [
                '當場禁止其行駛',
                '責令改正',
                '(若有改裝事實可沒入改裝物)'
            ];
            const annotations = [
                '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）'
            ];

            await context.replyFlex(
                '微型電動二輪車 - 執法結果',
                createResult('慢車違規速查', article, fineText, additionalCitations, annotations, null)
            );
        } else if (type === 'pedestrian') {
            const article = {
                code: '78條/80條',
                description: '行人違規 (不避讓緊急車輛/闖平交道等)'
            };
            const fineText = '500元 (不避讓) / 4,800元 (闖平交道)';
            const additionalCitations = [
                '78條：行人聞消防車等警號不避讓，處500元。',
                '80條：行人穿越平交道有不聽看候等情形，處4,800元。'
            ];
            const annotations = [
                '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）'
            ];

            await context.replyFlex(
                '行人違規 - 執法結果',
                createResult('行人違規速查', article, fineText, additionalCitations, annotations, null)
            );
        }
    }
};
