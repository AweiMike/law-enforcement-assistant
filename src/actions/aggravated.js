const { createResult } = require('../utils/flex');

module.exports = async function HandleAggravated(context) {
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
        createResult('加重刑責速查', article, fineText, additionalCitations, annotations, null)
    );
};
