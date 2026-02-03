const { createMenu } = require('../utils/flex');
const theme = require('../utils/theme');

module.exports = async function HandleFollow(context) {
    // Send welcome message with bot purpose
    const welcomeBubble = {
        type: 'bubble',
        styles: {
            header: { backgroundColor: theme.colors.surface },
            body: { backgroundColor: theme.colors.background },
        },
        header: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: '📜 青雲律令 (Cyan Cloud Decree)',
                    size: 'xl',
                    weight: 'bold',
                    color: theme.colors.text,
                    wrap: true,
                },
            ],
        },
        body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
                {
                    type: 'text',
                    text: '� 設立緣由',
                    size: 'lg',
                    weight: 'bold',
                    color: theme.colors.accent,
                },
                {
                    type: 'text',
                    text: '民國115年1月31日起，道路交通管理處罰條例進行了多項重大修正，包含無照駕駛累犯加重、酒駕吊銷終身、未禮讓行人加重處罰等。',
                    size: 'sm',
                    color: theme.colors.text,
                    wrap: true,
                },
                {
                    type: 'text',
                    text: '本機器人專為第一線執法同仁設計，協助您在執勤現場快速查詢新制規定、判定罰鍰級距，並提供標準作業程序 (SOP) 檢查表。',
                    size: 'sm',
                    color: theme.colors.subtext,
                    wrap: true,
                    margin: 'md',
                },
                {
                    type: 'separator',
                    margin: 'lg',
                },
                {
                    type: 'text',
                    text: '📋 功能簡介',
                    size: 'lg',
                    weight: 'bold',
                    color: theme.colors.accent,
                    margin: 'lg',
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    spacing: 'sm',
                    contents: [
                        { type: 'text', text: '� 無照駕駛 (21、21-1條)', size: 'sm', color: theme.colors.text },
                        { type: 'text', text: '🍺 酒後駕車 (35條)', size: 'sm', color: theme.colors.text },
                        { type: 'text', text: '🚶 未禮讓/未避讓 (44、45條)', size: 'sm', color: theme.colors.text },
                        { type: 'text', text: '🔧 其他違規 (改裝/慢車等)', size: 'sm', color: theme.colors.text },
                    ],
                    margin: 'sm',
                },
                {
                    type: 'separator',
                    margin: 'lg',
                },
                {
                    type: 'text',
                    text: '⚠️ 本系統適用 115/1/31 後新制，強制抽血與排氣管扣牌尚未生效。',
                    size: 'xs',
                    color: theme.colors.warning,
                    wrap: true,
                    margin: 'lg',
                },
                {
                    type: 'button',
                    style: 'primary',
                    color: theme.colors.success,
                    action: { type: 'postback', label: '� 開始使用', data: 'action=restart' },
                    margin: 'lg',
                    height: 'sm',
                },
            ],
        },
    };

    await context.replyFlex('歡迎使用青雲律令', welcomeBubble);
};
