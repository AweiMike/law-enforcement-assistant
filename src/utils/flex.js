const theme = require('./theme');

const createBubble = (title, subtitle, contents, footer) => {
    return {
        type: 'bubble',
        styles: {
            header: { backgroundColor: theme.colors.surface },
            body: { backgroundColor: theme.colors.background },
            footer: { backgroundColor: theme.colors.surface },
        },
        header: {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'text',
                    text: title,
                    ...theme.typography.h1,
                    wrap: true,
                },
                ...(subtitle ? [{
                    type: 'text',
                    text: subtitle,
                    ...theme.typography.body,
                    color: theme.colors.subtext,
                    wrap: true,
                    margin: 'sm',
                }] : []),
            ],
        },
        body: {
            type: 'box',
            layout: 'vertical',
            contents: contents,
        },
        ...(footer ? { footer } : {}),
    };
};

const createMenu = () => {
    return createBubble(
        '115年交通執法小幫手',
        '請選擇違規樣態 (適用115/1/31後新制)',
        [
            {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                contents: [
                    {
                        type: 'button',
                        style: 'primary',
                        color: theme.colors.accent,
                        action: { type: 'postback', label: '🛑 無照駕駛 (21條)', data: 'module=unlicensed' },
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'primary',
                        color: theme.colors.primary,
                        action: { type: 'postback', label: '🍺 酒後駕車 (35條)', data: 'module=drunk' },
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'primary',
                        color: theme.colors.success, // Use Green for Safety/Yield
                        action: { type: 'postback', label: '🚶 未禮讓/避讓 (44條)', data: 'module=yield' },
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'secondary', // Use Secondary for misc
                        color: theme.colors.warning, // Yellow for warnings/misc
                        action: { type: 'postback', label: '🔧 其他/改裝 (72條)', data: 'module=others' },
                        height: 'sm',
                    },
                    {
                        type: 'separator',
                        margin: 'md',
                    },
                    {
                        type: 'text',
                        text: '⚠️ 注意：本系統適用 115/1/31 後新制，強制抽血與排氣管扣牌尚未生效。',
                        color: theme.colors.warning,
                        size: 'xs',
                        wrap: true,
                        margin: 'md',
                    },
                ],
            },
        ]
    );
};

// Generic Selection Menu (Vehicle Type, History, etc.)
const createSelection = (title, question, options) => {
    return createBubble(
        title,
        question,
        [
            {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: options.map((opt) => ({
                    type: 'button',
                    style: 'secondary',
                    color: theme.colors.text,
                    action: { type: 'postback', label: opt.label, data: opt.data },
                    height: 'sm',
                })),
            },
        ]
    );
};

// Result Card with Logic
const createResult = (title, violationDetails, fines, sopSteps, warnings) => {
    const contents = [
        // Violation Details
        {
            type: 'box',
            layout: 'vertical',
            contents: [
                { type: 'text', text: '📋 違規詳情', weight: 'bold', color: theme.colors.subtext, size: 'sm' },
                { type: 'text', text: violationDetails, size: 'md', color: theme.colors.text, wrap: true, margin: 'xs' },
            ],
            margin: 'md',
        },
        { type: 'separator', margin: 'md' },
        // Fines (Highlighted)
        {
            type: 'box',
            layout: 'vertical',
            contents: [
                { type: 'text', text: '💸 預估罰鍰', weight: 'bold', color: theme.colors.subtext, size: 'sm' },
                {
                    type: 'text',
                    text: fines,
                    size: '3xl', // User requested Large Fonts
                    weight: 'bold',
                    color: theme.colors.accent,
                    wrap: true,
                    margin: 'sm'
                },
            ],
            margin: 'md',
        },
        { type: 'separator', margin: 'md' },
        // SOP Checklist
        {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
                { type: 'text', text: '🚨 現場處置 SOP', weight: 'bold', color: theme.colors.subtext, size: 'sm', margin: 'xs' },
                ...sopSteps.map(step => ({
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                        { type: 'text', text: '✅', flex: 1, size: 'sm' }, // Modern checkbox feel
                        { type: 'text', text: step, flex: 9, size: 'md', color: theme.colors.text, wrap: true }, // Larger text
                    ],
                    margin: 'sm',
                })),
            ],
            margin: 'md',
        },
    ];

    if (warnings) {
        contents.push({ type: 'separator', margin: 'md' });
        contents.push({
            type: 'text',
            text: `⚠️ ${warnings}`,
            color: theme.colors.warning,
            size: 'sm',
            wrap: true,
            margin: 'md',
        });
    }

    // Footer Button to restart
    const footer = {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'button',
                style: 'link',
                action: { type: 'postback', label: '🏠 返回主選單', data: 'action=restart' },
            }
        ],
    };

    return createBubble(title, '執法指引結果', contents, footer);
};

module.exports = {
    createMenu,
    createSelection,
    createResult,
};
