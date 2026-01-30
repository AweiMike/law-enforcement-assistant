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

        let fineRange = '';
        let sopSteps = [];
        let violationDetails = '';

        if (target === 'pedestrian') {
            violationDetails = '未暫停讓行人先行通過 (第44條)';
            if (consequence === 'none') {
                fineRange = '1,200 ~ 6,000 元';
                sopSteps = ['依一般違規程序舉發'];
            } else if (consequence === 'injury') {
                fineRange = '7,200 ~ 36,000 元';
                sopSteps = ['當場舉發', '吊扣駕照 1 年'];
            } else {
                fineRange = '36,000 元 (致人重傷或死亡)'; // Wait, strictly checking art 44... 
                // New law says: 7,200-36,000 for injury; 36,000 for severe/death + Revocation
                sopSteps = ['當場舉發', '吊銷駕照 (禁考3年)'];
            }
        } else {
            violationDetails = '聞消防車、救護車等警號不避讓 (第45條)';
            if (consequence === 'none') {
                fineRange = '3,600 元 + 吊銷駕照';
                sopSteps = ['當場舉發', '吊銷駕照 (禁考1年)', '吊扣牌照 3個月']; // Re-check law logic or stick to user prompt
                // User prompt says: 6000-30000 + Revocation + Plate Suspension 6 months
                fineRange = '6,000 ~ 30,000 元';
                sopSteps = ['吊銷駕照', '吊扣牌照 6個月'];
            } else {
                fineRange = '10,000 ~ 100,000 元'; // User prompt says 10k-100k
                sopSteps = ['吊銷駕照', '吊銷牌照'];
            }
        }

        await context.replyFlex(
            '未禮讓/未避讓 - 執法結果',
            createResult(
                '執法結果：未禮讓/未避讓',
                violationDetails,
                fineRange,
                sopSteps
            )
        );
    }
};
