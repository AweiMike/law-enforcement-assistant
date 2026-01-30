const { createSelection, createResult } = require('../utils/flex');

module.exports = async function HandleDrunk(context) {
    const payload = context.event.payload;

    // Step 1: Select Type
    if (payload === 'module=drunk') {
        await context.replyFlex(
            '酒後駕車 - 違規態樣',
            createSelection('酒後駕車 (35條)', '請選擇違規情形', [
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

        let licenseAction = '';
        let fineText = '依酒精濃度/車種裁罰基準表';

        // Logic
        if (type === 'refusal') {
            licenseAction = '吊銷駕照 + 終身不得考領';
            fineText = '180,000 元 (拒測)';
        } else if (accident === 'severe') {
            licenseAction = '吊銷駕照 + 終身不得考領';
            if (type === 'over') fineText += ' + 致人重傷死亡加重';
        } else {
            licenseAction = '吊扣駕照 1~4 年';
        }

        const sopSteps = [
            '當場移置保管車輛 (拖吊)',
            '當場拆卸扣繳牌照 (一律扣牌 2 年)',
            `駕照處分：${licenseAction}`,
            '禁駛 (若無才可由他人代駕)'
        ];

        let warnings = '';
        if (type === 'refusal') {
            warnings = '拒測強行抽血程序尚未上路，仍需報請檢察官核發許可書 (舊制流程)。';
        }

        await context.replyFlex(
            '酒後駕車 - 執法結果',
            createResult(
                '執法結果：酒後駕車',
                `第35條 - ${type === 'refusal' ? '拒測' : '酒測超標'} / ${accident === 'none' ? '未肇事' : (accident === 'injury' ? '致傷' : '致重傷死亡')}`,
                fineText,
                sopSteps,
                warnings
            )
        );
    }
};
