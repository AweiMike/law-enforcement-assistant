const { createBubble } = require('../utils/flex'); // Assuming createBubble is exported or I need to modify flex.js to export it. 
// Wait, I should check what is exported from flex.js.
// Based on previous reads, createBubble is NOT exported. createMenu, createSelection, createResult ARE exported.
// I should probably add a createToolsUI function in flex.js or tools.js.
// Let's implement the UI construction inside tools.js for now to keep flex.js clean, 
// using a similar pattern but I need access to theme. 
// Actually, it's better to add createToolsMenu to flex.js to maintain consistency and access theme.

// Let's verify flex.js exports first.
const theme = require('../utils/theme');
const dateUtils = require('../utils/date');

function createToolsUI(ageResult = null) {
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
                        {
                            type: 'text',
                            text: '輸入 6或7碼 民國生日',
                            size: 'xs',
                            color: theme.colors.subtext,
                            margin: 'none'
                        },
                        {
                            type: 'text',
                            text: '(例如: 680101 或 1000101)',
                            size: 'xs',
                            color: theme.colors.subtext,
                            margin: 'none'
                        },
                        {
                            type: 'button',
                            style: 'primary',
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

    // Insert Age Result if available
    if (ageResult) {
        // Find the index to insert result (inside Age Calculator section, before button)
        // Actually, let's just display it above the button or replace the button area? 
        // Showing it as a separate highlighted box is better.

        const resultBox = {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            backgroundColor: theme.colors.background, // Inner box
            cornerRadius: 'sm',
            paddingAll: 'md',
            contents: [
                {
                    type: 'text',
                    text: `生日: ${ageResult.input}`,
                    size: 'sm',
                    color: theme.colors.subtext,
                    align: 'center'
                },
                {
                    type: 'text',
                    text: `${ageResult.age}歲 ${ageResult.months}個月`,
                    size: 'xxl',
                    weight: 'bold',
                    color: theme.colors.success,
                    align: 'center',
                    margin: 'sm'
                }
            ]
        };

        // Insert into the UI contents
        // We pressed the button, so we probably want to show the result clearly. 
        // Let's modify the Age Section.
        // Simplified approach: Rebuild the whole Age Section content.

        // For now, let's just create a full Bubble object.
    }

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

    // Initial State
    if (payload === 'module=tools') {
        context.setState({
            tools: { mode: 'view' }
        });
        await context.replyFlex('執法工具', createToolsUI());
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

        const { years, months } = dateUtils.calculateAge(birthDate);

        // Reply with Result + Tools UI again
        // We need to inject the result into the UI
        const ui = createToolsUI();

        // Add result bubble/box to Age Section
        // Finding Age Section (index 2 in contents array)
        // This is a bit brittle, so let's just append the result in a nice way.

        // Better yet, modify createToolsUI to accept result
        // But for now, let's just make a dynamic UI construction.

        // Let's modify createToolsUI logic in this file to be cleaner.
        // (See rewrite below)
    }
};
