const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleOthers(context) {
    const payload = context.event.payload;

    // Step 1: Select Category
    if (payload === 'module=others') {
        await context.replyFlex(
            '其他違規 - 類別',
            createSelection('其他違規 (改裝/慢車)', '請選擇類別', [
                { label: '🚲 微型電動二輪車 (72條)', data: 'others_ebike' },
                { label: '🚶 行人違規 (78、80條)', data: 'others_pedestrian' },
                { label: '🔊 排氣管改裝 (16條)', data: 'others_exhaust' },
            ])
        );
        return;
    }

    // Step 2: Result
    if (payload.startsWith('others_')) {
        const type = payload.split('_')[1];

        if (type === 'ebike') {
            await context.replyFlex(
                '微型電動二輪車 - 執法結果',
                createResult(
                    '執法結果：微型電動二輪車',
                    '擅自變更電子控制裝置 (提速/不明)',
                    '3,600 ~ 7,200 元',
                    ['當場禁止其行駛', '責令改正', '(若有改裝事實可沒入改裝物)'],
                )
            );
        } else if (type === 'pedestrian') {
            await context.replyFlex(
                '行人違規 - 執法結果',
                createResult(
                    '執法結果：行人違規',
                    '聞警號不避讓 / 闖平交道',
                    '500 元 (不避讓) / 4,800 元 (闖平交道)', // Just showing both according to request
                    ['當場舉發'],
                )
            );
        } else if (type === 'exhaust') {
            await context.replyFlex(
                '排氣管改裝 - ⚠️ 特別提示',
                createResult(
                    '排氣管改裝 (第16條)',
                    '⚠️ 尚未施行',
                    '不可依新法執行',
                    [
                        '請依現行規定處理 (通報環保局)',
                        '不可當場扣牌 (新法未生效)',
                        '噪音管制法仍適用'
                    ],
                    '第16條排氣管登記與扣牌規定列為「另訂施行日期」。'
                )
            );
        }
    }
};
