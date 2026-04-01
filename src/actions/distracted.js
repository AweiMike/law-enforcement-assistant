const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleDistracted(context) {
    const payload = context.event.payload;

    // Step 1: Select violation type
    if (payload === 'module=distracted') {
        await context.replyFlex(
            '手持裝置/吸菸 - 類別',
            createSelection('手持裝置/吸菸 (31-1條)', '請選擇違規情形', [
                { label: '📱 手持行動電話/裝置', data: 'distracted_phone' },
                { label: '🚬 手持香菸/吸菸', data: 'distracted_smoke' },
            ])
        );
        return;
    }

    // Step 2: Phone - Select vehicle type
    if (payload === 'distracted_phone') {
        await context.replyFlex(
            '手持裝置 - 車種',
            createSelection('手持行動電話/裝置', '請選擇駕駛車種', [
                { label: '🚗 汽車駕駛人', data: 'distracted_phone_car' },
                { label: '🏍️ 機車駕駛人', data: 'distracted_phone_moto' },
            ])
        );
        return;
    }

    // Step 3: Results
    if (payload === 'distracted_phone_car') {
        const article = {
            code: '31-1條第1項',
            description: '汽車駕駛人行駛道路時，以手持方式使用行動電話、電腦或其他相類功能裝置進行撥接、通話、數據通訊或其他有礙駕駛安全之行為'
        };
        const fineText = '處新臺幣 3,000 元罰鍰';
        const additionalCitations = [
            '行為態樣：撥接、通話、數據通訊或其他有礙駕駛安全之行為',
            '「手持方式」使用始構成違規',
            '警備車、消防車及救護車依法執行任務所必要者，不受此限（第4項）'
        ];
        const annotations = [
            '115/3/31 起施行（行政院院臺交字第1151007003A號）',
            '實施及宣導辦法由交通部定之（第5項）'
        ];

        await context.replyFlex(
            '手持裝置(汽車) - 執法結果',
            createResult('手持裝置速查', article, fineText, additionalCitations, annotations, null)
        );
        return;
    }

    if (payload === 'distracted_phone_moto') {
        const article = {
            code: '31-1條第2項',
            description: '機車駕駛人行駛於道路時，以手持方式使用行動電話、電腦或其他相類功能裝置進行撥接、通話、數據通訊或其他有礙駕駛安全之行為'
        };
        const fineText = '處新臺幣 1,200 元罰鍰';
        const additionalCitations = [
            '行為態樣：撥接、通話、數據通訊或其他有礙駕駛安全之行為',
            '「手持方式」使用始構成違規',
            '⚠️ 原為1,000元，修法後提高至1,200元'
        ];
        const annotations = [
            '115/3/31 起施行（行政院院臺交字第1151007003A號）',
            '實施及宣導辦法由交通部定之（第5項）'
        ];

        await context.replyFlex(
            '手持裝置(機車) - 執法結果',
            createResult('手持裝置速查', article, fineText, additionalCitations, annotations, null)
        );
        return;
    }

    if (payload === 'distracted_smoke') {
        const article = {
            code: '31-1條第3項',
            description: '汽機車駕駛人行駛於道路，手持香菸、吸食、點燃香菸致有影響他人行車安全之行為'
        };
        const fineText = '處新臺幣 1,200 元罰鍰';
        const additionalCitations = [
            '須有「影響他人行車安全」之具體行為',
            '行為態樣：手持、吸食、點燃香菸',
            '⚠️ 原為600元，修法後提高至1,200元（加倍）',
            '適用對象：汽車及機車駕駛人均適用'
        ];
        const annotations = [
            '115/3/31 起施行（行政院院臺交字第1151007003A號）'
        ];

        await context.replyFlex(
            '手持吸菸 - 執法結果',
            createResult('手持吸菸速查', article, fineText, additionalCitations, annotations, null)
        );
        return;
    }
};
