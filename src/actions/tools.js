const theme = require('../utils/theme');
const dateUtils = require('../utils/date');

function createToolsBubble(ageResult = null) {
    const today = dateUtils.getCurrentROCDate();
    const day30 = dateUtils.addDays(30);
    const day45 = dateUtils.addDays(45);

    const contents = [
        // Header
        {
            type: 'text',
            text: '🧮 執法工具',
            weight: 'bold',
            size: 'xl',
            color: theme.colors.primary,
            align: 'center',
            margin: 'md',
        },
        { type: 'separator', margin: 'md' },

        // Section 1: Due Date Calculator
        {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
                {
                    type: 'text',
                    text: '📅 到案日期計算',
                    weight: 'bold',
                    size: 'md',
                    color: theme.colors.text,
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'sm',
                    backgroundColor: theme.colors.surface,
                    cornerRadius: 'md',
                    paddingAll: 'md',
                    contents: [
                        {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                                { type: 'text', text: '今日', size: 'sm', color: theme.colors.subtext, flex: 1 },
                                { type: 'text', text: today, size: 'sm', color: theme.colors.text, weight: 'bold', flex: 2, align: 'end' },
                            ]
                        },
                        { type: 'separator', margin: 'sm' },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            margin: 'sm',
                            contents: [
                                { type: 'text', text: '+30日', size: 'md', color: theme.colors.accent, flex: 1 },
                                { type: 'text', text: day30, size: 'md', color: theme.colors.accent, weight: 'bold', flex: 2, align: 'end' },
                            ]
                        },
                        {
                            type: 'box',
                            layout: 'horizontal',
                            margin: 'sm',
                            contents: [
                                { type: 'text', text: '+45日', size: 'md', color: theme.colors.accent, flex: 1 },
                                { type: 'text', text: day45, size: 'md', color: theme.colors.accent, weight: 'bold', flex: 2, align: 'end' },
                            ]
                        },
                    ]
                }
            ]
        },

        // Section 2: Age Calculator
        {
            type: 'box',
            layout: 'vertical',
            margin: 'xl',
            contents: [
                {
                    type: 'text',
                    text: '🎂 年齡查詢',
                    weight: 'bold',
                    size: 'md',
                    color: theme.colors.text,
                },
                {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'sm',
                    backgroundColor: theme.colors.surface,
                    cornerRadius: 'md',
                    paddingAll: 'md',
                    contents: [
                        // Result Display (If available)
                        ...(ageResult ? [
                            {
                                type: 'text',
                                text: `生日: ${ageResult.input}`,
                                size: 'sm',
                                color: theme.colors.subtext,
                                align: 'center'
                            },
                            {
                                type: 'text',
                                text: `${ageResult.years}歲 ${ageResult.months}個月 ${ageResult.days}天`,
                                size: 'xxl',
                                weight: 'bold',
                                color: theme.colors.success,
                                align: 'center',
                                margin: 'sm'
                            },
                            { type: 'separator', margin: 'md' },
                        ] : []),

                        // Instruction
                        {
                            type: 'text',
                            text: ageResult ? '查詢其他生日：' : '輸入 6或7碼 民國生日',
                            size: 'xs',
                            color: theme.colors.subtext,
                            margin: ageResult ? 'md' : 'none'
                        },
                        // Button
                        {
                            type: 'button',
                            style: ageResult ? 'secondary' : 'primary',
                            color: theme.colors.primary,
                            height: 'sm',
                            margin: 'md',
                            action: {
                                type: 'postback',
                                label: '⌨️ 輸入生日',
                                data: 'action=tools_input_age'
                            }
                        }
                    ]
                }
            ]
        },

        { type: 'separator', margin: 'lg' },

        // Footer: Back to Menu
        {
            type: 'button',
            style: 'link',
            height: 'sm',
            margin: 'md',
            action: {
                type: 'postback',
                label: '🏠 回主選單',
                data: 'action=restart'
            }
        }
    ];

    return {
        type: 'bubble',
        header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: theme.colors.surface,
            contents: [{ type: 'text', text: '執法小幫手', color: theme.colors.subtext, size: 'xs' }]
        },
        body: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: theme.colors.background,
            contents: contents
        }
    };
}

module.exports = async function HandleTools(context) {
    const payload = context.event.payload || '';

    // Initial State: View Tools Menu
    if (payload === 'module=tools') {
        context.setState({
            tools: { mode: 'view' }
        });
        await context.replyFlex('執法工具', createToolsBubble());
        return;
    }

    // Request Input Age
    if (payload === 'action=tools_input_age') {
        context.setState({
            tools: { mode: 'input_age' }
        });
        await context.replyText('請輸入民國生日 (6碼或7碼)\n例如：680101 或 1000101');
        return;
    }

    // Handle Text Input for Age
    if (context.event.isText && context.state.tools && context.state.tools.mode === 'input_age') {
        const input = context.event.text.trim();
        const birthDate = dateUtils.parseROCBirthdate(input);

        if (!birthDate) {
            await context.replyText('⚠️ 格式錯誤！\n請輸入 6或7碼 數字\n例如：68年1月1日請輸入 680101');
            return;
        }

        const { years, months, days } = dateUtils.calculateAge(birthDate);

        // Reset mode to view, but keeping result doesn't persist in state unless we want to.
        // We can just reply with the Flex Message containing the result.
        context.setState({
            tools: { mode: 'view' }
        });

        await context.replyFlex('年齡查詢結果', createToolsBubble({
            input: input,
            years,
            months,
            days
        }));
    }
};
