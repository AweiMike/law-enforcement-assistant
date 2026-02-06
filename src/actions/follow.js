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
                    text: '🛠️ 系統開發與聲明',
                    size: 'lg',
                    weight: 'bold',
                    color: theme.colors.accent,
                },
                {
                    type: 'text',
                    text: '本系統為「東澤」個人利用勤餘時間開發，旨在協助同仁快速查詢繁雜的交通新制。\n特別感謝「新化分局交通組、交通分隊全體同仁」協助測試與驗證。',
                    size: 'sm',
                    color: theme.colors.text,
                    wrap: true,
                    margin: 'md',
                },
                {
                    type: 'separator',
                    margin: 'lg',
                },
                {
                    type: 'text',
                    text: '⚠️ 非公務正式系統',
                    size: 'lg',
                    weight: 'bold',
                    color: theme.colors.warning,
                    margin: 'lg',
                },
                {
                    type: 'text',
                    text: '本小幫手「非」警政署或相關單位發布之正式軟體。查詢結果僅供參考，作為執勤時的輔助判斷。',
                    size: 'sm',
                    color: theme.colors.text,
                    wrap: true,
                    margin: 'md',
                },
                {
                    type: 'text',
                    text: '若涉及舉發開單或回復民眾等正式程序，請務必再次核對最新法令規定或洽詢該管交通組/裁決單位，以確保正確性並維護機關公信力。',
                    size: 'sm',
                    color: theme.colors.text,
                    weight: 'bold',
                    wrap: true,
                    margin: 'md',
                },
                {
                    type: 'button',
                    style: 'primary',
                    color: theme.colors.success,
                    action: { type: 'postback', label: '🚀 開始使用', data: 'action=restart' },
                    margin: 'xl',
                    height: 'sm',
                },
            ],
        },
    };

    await context.replyFlex('歡迎使用青雲律令', welcomeBubble);
};
