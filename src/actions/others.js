const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleOthers(context) {
    const payload = context.event.payload;

    // Step 1: Select Category
    if (payload === 'module=others') {
        await context.replyFlex(
            '其他違規 - 類別',
            createSelection('其他違規 (改裝/慢車/加重)', '請選擇類別', [
                { label: '🚲 微型電動二輪車 (72條)', data: 'others_ebike' },
                { label: '🚶 行人違規 (78、80條)', data: 'others_pedestrian' },
                { label: '🔊 排氣管改裝 (16條) ✅已施行', data: 'others_exhaust' },
                { label: '⚖️ 加重刑責事由 (86條) 🆕', data: 'others_aggravated' },
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
                createResult(
                    '慢車違規速查',
                    article,
                    fineText,
                    additionalCitations,
                    annotations,
                    null
                )
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
                createResult(
                    '行人違規速查',
                    article,
                    fineText,
                    additionalCitations,
                    annotations,
                    null
                )
            );
        } else if (type === 'exhaust') {
            const article = {
                code: '16條',
                description: '排氣管改裝（噪音管制）— 115/3/31 起施行'
            };
            const fineText = '處新臺幣 1,800～5,400 元罰鍰';
            const additionalCitations = [
                '責令改正並限期至指定檢驗機構檢驗',
                '未依限改正覆驗合格者，得扣繳牌照',
                '噪音管制法仍併行適用（可通報環保局）'
            ];
            const annotations = [
                '115/3/31 起施行（行政院院臺交字第1151007003A號）',
                '114年11月19日修正公布',
                '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）'
            ];

            await context.replyFlex(
                '排氣管改裝 - 執法結果',
                createResult(
                    '排氣管改裝速查',
                    article,
                    fineText,
                    additionalCitations,
                    annotations,
                    null
                )
            );
        } else if (type === 'aggravated') {
            const article = {
                code: '86條第1項',
                description: '汽車駕駛人有下列情形之一，因而致人受傷或死亡，依法應負刑事責任者，得加重其刑至二分之一'
            };
            const fineText = '加重其刑至二分之一';
            const additionalCitations = [
                '一、未領有駕駛執照駕車',
                '二、駕駛執照經吊銷、註銷或吊扣期間駕車',
                '三、酒醉駕車',
                '四、吸食毒品、迷幻藥、麻醉藥品或其相類似之管制藥品駕車',
                '五、行駛人行道、行近行人穿越道或其他依法可供行人穿越之交岔路口不依規定讓行人優先通行',
                '🆕 六、行經設有學校、醫院標誌之路段，不減速慢行',
                '七、行車速度超過規定之最高時速40公里以上',
                '八、任意以迫近、驟然變換車道或其他不當方式，迫使他車讓道',
                '九、非遇突發狀況，在行駛途中任意驟然減速、煞車或於車道中暫停',
                '十、二輛以上之汽車在道路上競駛、競技',
                '十一、連續闖紅燈併有超速行為'
            ];
            const annotations = [
                '🆕 第6款為115/3/31起新增施行（行政院院臺交字第1151007003A號）',
                '115年1月14日修正公布',
                '第2項：快車道駕車因行人或慢車擅入而致人傷亡者，減輕其刑'
            ];

            await context.replyFlex(
                '加重刑責事由 - 86條',
                createResult(
                    '加重刑責速查',
                    article,
                    fineText,
                    additionalCitations,
                    annotations,
                    null
                )
            );
        }
    }
};
