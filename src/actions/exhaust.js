const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleExhaust(context) {
    const payload = context.event.payload;

    // Step 1: Select violation type
    if (payload === 'module=exhaust') {
        await context.replyFlex(
            '排氣管/噪音設備 - 態樣',
            createSelection('第16條 排氣管/噪音設備', '請選擇違規態樣', [
                { label: '🔧 非原型式排氣管未申報登記 🆕', data: 'exhaust_unreg' },
                { label: '💨 排氣管/消音器設備不全或損壞', data: 'exhaust_damage' },
                { label: '📢 高音量喇叭/噪音器物', data: 'exhaust_horn' },
            ])
        );
        return;
    }

    // Results
    if (payload === 'exhaust_unreg') {
        const article = {
            code: '16條第2項',
            description: '非原型式排氣管不依規定申報異動登記'
        };
        const fineText = '處汽車所有人新臺幣 3,600 元（最高額加倍）';
        const additionalCitations = [
            '責令15日內至指定機構檢驗（公路監理機關得收取檢驗費）',
            '逾期15日以上 → 吊扣牌照（至檢驗合格後發還）',
            '逾期2個月以上 → 註銷牌照',
            '⚠️ 處罰對象為「汽車所有人」非駕駛人（本條例「汽車」含機車）'
        ];
        const annotations = [
            '115/3/31 起施行（行政院院臺交字第1151007003A號）',
            '114年11月19日修正公布',
            '本項為第16條第1項第1款之特別規定，針對「非原型式排氣管」未申報異動登記，按最高額(1,800元)加倍處罰',
            '噪音管制法仍併行適用（可通報環保局）'
        ];

        await context.replyFlex(
            '非原型式排氣管 - 執法結果',
            createResult('排氣管速查', article, fineText, additionalCitations, annotations, null)
        );
        return;
    }

    if (payload === 'exhaust_damage') {
        const article = {
            code: '16條第1項第2款',
            description: '排氣管、消音器設備不全或損壞不予修復，或擅自增、減、變更原有規格致影響行車安全'
        };
        const fineText = '處汽車所有人新臺幣 900～1,800 元罰鍰';
        const additionalCitations = [
            '責令改正',
            '⚠️ 處罰對象為「汽車所有人」非駕駛人（本條例「汽車」含機車）',
            '含「擅自增減變更原有規格」之情形'
        ];
        const annotations = [
            '本款亦涵蓋：除頭燈外之燈光、雨刮、喇叭、照後鏡等設備不全或損壞',
            '參考資料：駕照及車種違規舉發對照表（114年11月6日修正）'
        ];

        await context.replyFlex(
            '排氣管設備不全 - 執法結果',
            createResult('排氣管速查', article, fineText, additionalCitations, annotations, null)
        );
        return;
    }

    if (payload === 'exhaust_horn') {
        const article = {
            code: '16條第1項第6款',
            description: '裝置高音量或發出不合規定音調之喇叭或其他產生噪音器物'
        };
        const fineText = '處汽車所有人新臺幣 1,800 元（依最高額處罰）';
        const additionalCitations = [
            '高音量喇叭或噪音器物應沒入',
            '⚠️ 處罰對象為「汽車所有人」非駕駛人（本條例「汽車」含機車）'
        ];
        const annotations = [
            '本款依法應按最高額處罰，且噪音器物「應」沒入（非得沒入）',
            '噪音管制法仍併行適用（可通報環保局）'
        ];

        await context.replyFlex(
            '高音量喇叭/噪音器物 - 執法結果',
            createResult('噪音設備速查', article, fineText, additionalCitations, annotations, null)
        );
        return;
    }
};
