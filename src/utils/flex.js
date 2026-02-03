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
                        color: theme.colors.success,
                        action: { type: 'postback', label: '🚶 未禮讓/避讓 (44條)', data: 'module=yield' },
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'secondary',
                        color: theme.colors.warning,
                        action: { type: 'postback', label: '🔧 其他/改裝 (72條)', data: 'module=others' },
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'secondary',
                        color: theme.colors.subtext, // Using a neutral color for tools
                        action: { type: 'postback', label: '🧮 執法工具 (日期/年齡)', data: 'module=tools' },
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

/**
 * Enhanced Result Card matching reference app format
 * @param {string} title - Main title
 * @param {object} article - { code: '21條1項1款', description: '未領有駕駛執照駕駛小型車或機車' }
 * @param {string} fineText - Fine amount text
 * @param {string[]} additionalCitations - Array of additional citations to issue (加開)
 * @param {string[]} annotations - Legal references/notes
 * @param {string} warnings - Warning text
 * @param {string} summary - Optional summary of selected conditions (已選條件摘要)
 */
const createResult = (title, article, fineText, additionalCitations, annotations, warnings, summary) => {
    const contents = [];

    // 已選條件 Section (Summary) - 放在最上方
    if (summary) {
        contents.push({
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                        {
                            type: 'box',
                            layout: 'vertical',
                            contents: [{ type: 'text', text: '已選條件', size: 'xs', color: '#ffffff' }],
                            backgroundColor: theme.colors.subtext,
                            paddingAll: 'xs',
                            cornerRadius: 'sm',
                            width: '70px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ],
                },
                {
                    type: 'text',
                    text: summary,
                    size: 'xs',
                    color: theme.colors.text,
                    wrap: true,
                    margin: 'sm',
                },
            ],
            margin: 'md',
            backgroundColor: theme.colors.surface,
            paddingAll: 'md',
            cornerRadius: 'md',
        });
        contents.push({ type: 'separator', margin: 'lg' });
    }

    // 條款 Section (Article)
    contents.push({
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'box',
                layout: 'horizontal',
                contents: [
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [{ type: 'text', text: '條款', size: 'xs', color: '#ffffff' }],
                        backgroundColor: theme.colors.primary,
                        paddingAll: 'xs',
                        cornerRadius: 'sm',
                        width: '50px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ],
            },
            {
                type: 'text',
                text: article.code,
                size: 'xxl',
                weight: 'bold',
                color: theme.colors.text,
                margin: 'sm',
            },
            {
                type: 'text',
                text: article.description,
                size: 'sm',
                color: theme.colors.subtext,
                wrap: true,
                margin: 'xs',
            },
        ],
        margin: 'md',
    });

    // 罰鍰 Section (Fine)
    contents.push({
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'box',
                layout: 'horizontal',
                contents: [
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [{ type: 'text', text: '罰鍰', size: 'xs', color: '#ffffff' }],
                        backgroundColor: theme.colors.accent,
                        paddingAll: 'xs',
                        cornerRadius: 'sm',
                        width: '50px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ],
            },
            {
                type: 'text',
                text: fineText,
                size: 'xl',
                weight: 'bold',
                color: theme.colors.accent,
                wrap: true,
                margin: 'sm',
            },
        ],
    });

    // 分隔線
    contents.push({ type: 'separator', margin: 'lg' });

    // +加開 Section (Additional Citations)
    contents.push({
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'box',
                layout: 'horizontal',
                contents: [
                    {
                        type: 'box',
                        layout: 'vertical',
                        contents: [{ type: 'text', text: '+加開', size: 'xs', color: '#ffffff' }],
                        backgroundColor: theme.colors.success,
                        paddingAll: 'xs',
                        cornerRadius: 'sm',
                        width: '55px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ],
            },
            ...additionalCitations.map((citation, idx) => ({
                type: 'text',
                text: `${idx + 1}. ${citation}`,
                size: 'sm',
                color: theme.colors.text,
                wrap: true,
                margin: idx === 0 ? 'md' : 'sm',
            })),
        ],
        margin: 'lg',
    });

    // Add Annotations Section (註釋)
    if (annotations && annotations.length > 0) {
        contents.push({ type: 'separator', margin: 'lg' });
        contents.push({
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
                { type: 'text', text: '📌 註釋', weight: 'bold', color: theme.colors.subtext, size: 'sm' },
                ...annotations.map((note, idx) => ({
                    type: 'text',
                    text: `${idx + 1}. ${note}`,
                    size: 'xs',
                    color: theme.colors.subtext,
                    wrap: true,
                    margin: 'sm',
                })),
            ],
            margin: 'lg',
        });
    }

    // Add Warnings
    if (warnings) {
        contents.push({ type: 'separator', margin: 'lg' });
        contents.push({
            type: 'text',
            text: `⚠️ ${warnings}`,
            color: theme.colors.warning,
            size: 'sm',
            wrap: true,
            margin: 'lg',
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

    return createBubble(title, null, contents, footer);
};

module.exports = {
    createMenu,
    createSelection,
    createResult,
};
