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
        '📜 淺山執法通',
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
                        style: 'primary',
                        color: '#1E90FF', // DodgerBlue
                        action: { type: 'postback', label: '🚛 超載計算機 (29-2)', data: 'module=overload' },
                        height: 'sm',
                    },
                    {
                        type: 'button',
                        style: 'secondary',
                        color: theme.colors.subtext, // Using a neutral color for tools
                        action: { type: 'postback', label: '🧮 輔助計算工具(年齡/到案日期)', data: 'module=tools' },
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
                    { type: 'separator', margin: 'md' },
                    {
                        type: 'text',
                        text: '免責聲明：本系統為個人開發，僅供參考。內容無法保證完全無誤，參照作執勤用途前，務必再次確認是否符合要件。',
                        color: '#aaaaaa',
                        size: 'xxs',
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
        ],
        {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'button',
                    style: 'link',
                    action: { type: 'postback', label: '🏠 回主選單', data: 'action=restart' },
                }
            ],
        }
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



    // Disclaimer
    contents.push({ type: 'separator', margin: 'lg' });
    contents.push({
        type: 'text',
        text: '免責聲明：本系統為個人開發，僅供參考。內容無法保證完全無誤，參照作執勤用途前，務必再次確認是否符合要件。',
        color: '#aaaaaa',
        size: 'xxs',
        wrap: true,
        margin: 'md',
    });

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

const createOverloadResult = (authorized, actual, overloadWeight, overloadPercent, result) => {
    const isViolation = result.fine > 0;
    const headerColor = isViolation ? theme.colors.warning : theme.colors.success;

    const contents = [
        // Status Row
        {
            type: 'text',
            text: result.status,
            size: 'xxl',
            weight: 'bold',
            color: headerColor,
            align: 'center',
            margin: 'md',
        },
        { type: 'separator', margin: 'md' },

        // Weight Info
        {
            type: 'box',
            layout: 'horizontal',
            contents: [
                { type: 'text', text: '核定總重', size: 'sm', color: theme.colors.subtext, flex: 1 },
                { type: 'text', text: `${authorized} t`, size: 'sm', weight: 'bold', align: 'end', flex: 1 }
            ],
            margin: 'md'
        },
        {
            type: 'box',
            layout: 'horizontal',
            contents: [
                { type: 'text', text: '實際總重', size: 'sm', color: theme.colors.subtext, flex: 1 },
                { type: 'text', text: `${actual} t`, size: 'sm', weight: 'bold', align: 'end', flex: 1 }
            ],
            margin: 'sm'
        },
        {
            type: 'box',
            layout: 'horizontal',
            contents: [
                { type: 'text', text: '超載重量', size: 'sm', color: theme.colors.warning, flex: 1 },
                { type: 'text', text: `${overloadWeight > 0 ? '+' : ''}${overloadWeight.toFixed(2)} t`, size: 'sm', weight: 'bold', color: theme.colors.warning, align: 'end', flex: 1 }
            ],
            margin: 'sm'
        },
        {
            type: 'text',
            text: `(超載率 ${(overloadPercent * 100).toFixed(1)}%)`,
            size: 'xs',
            color: theme.colors.subtext,
            align: 'end',
            margin: 'xs'
        },
        { type: 'separator', margin: 'md' },
    ];

    // Fine & Action Section
    if (result.fine > 0) {
        contents.push({
            type: 'box',
            layout: 'horizontal',
            contents: [
                { type: 'text', text: '預估罰鍰', size: 'md', weight: 'bold', flex: 1, align: 'start' },
                { type: 'text', text: `$${result.fine.toLocaleString()}`, size: 'xl', weight: 'bold', color: theme.colors.highlight, flex: 2, align: 'end' }
            ],
            margin: 'md'
        });
    }

    if (result.points > 0) {
        contents.push({
            type: 'text',
            text: `⚠️ 記違規紀錄 ${result.points} 次`,
            size: 'sm',
            color: theme.colors.accent,
            align: 'end',
            margin: 'sm'
        });
    }

    if (result.action) {
        contents.push({
            type: 'text',
            text: `處置: ${result.action}`,
            size: 'sm',
            weight: 'bold',
            color: theme.colors.primary,
            wrap: true,
            margin: 'md'
        });
    }

    if (result.article) {
        contents.push({
            type: 'text',
            text: `條例: ${result.article}`,
            size: 'xxs',
            color: theme.colors.subtext,
            wrap: true,
            margin: 'md'
        });
    }

    // Calculation Details (Collapsible-like visual)
    if (result.details && result.details.length > 0) {
        contents.push({ type: 'separator', margin: 'lg' });
        contents.push({ type: 'text', text: '計算明細', size: 'xs', color: theme.colors.subtext, margin: 'md' });
        result.details.forEach(detail => {
            contents.push({
                type: 'text',
                text: `• ${detail}`,
                size: 'xxs',
                color: theme.colors.subtext,
                wrap: true,
                margin: 'xs'
            });
        });
    }

    // Legal Notes (Added based on user request)
    contents.push({ type: 'separator', margin: 'lg' });
    contents.push({
        type: 'text',
        text: '※ 註釋與判讀標準',
        size: 'sm',
        weight: 'bold',
        color: theme.colors.primary,
        margin: 'md'
    });

    const notes = [
        '1. 核定總重怎麼判斷？',
        '   (1) 聯結車依總聯結重、第五輪載重其中數值較低者為基準。',
        '   (2) 其餘種類依車輛總重為基準。',
        '   (3) 如有舉軸(輪胎舉起不落地)情形，依據交通部95.05.30.交路字第0950033500號函，請參考安全規則附件十一，依車輛落地軸數查表做為基準。',
        '',
        '2. 過磅原則：',
        '   過磅時，不含駕駛人重量。',
        '',
        '3. 卸貨分裝及勸導：',
        '   依據處理細則12條、13條辦理。',
        '',
        '4. 整體物品（不可分割）特殊規定：',
        '   如裝載貨物為「整體物」（如工程機具、一體式建材等）：',
        '   - 超重且「未請領」臨時通行證者：依處罰條例29條1項2款舉發（定額罰鍰）。',
        '   - 已請領通行證，仍超出核准之重量：方得依原車核定總重舉發29-2條（累進費率）。'
    ];

    notes.forEach(note => {
        if (note.trim() === '') return; // Skip empty lines to prevent API error
        contents.push({
            type: 'text',
            text: note,
            size: 'xxs',
            color: theme.colors.subtext,
            wrap: true,
            margin: 'xs'
        });
    });

    // Disclaimer
    contents.push({ type: 'separator', margin: 'lg' });
    contents.push({
        type: 'text',
        text: '免責聲明：本系統為個人開發，僅供參考。內容無法保證完全無誤，參照作執勤用途前，務必再次確認是否符合要件。',
        color: '#aaaaaa',
        size: 'xxs',
        wrap: true,
        margin: 'md',
    });

    const footer = {
        type: 'box',
        layout: 'vertical',
        contents: [
            {
                type: 'button',
                style: 'link',
                action: { type: 'postback', label: '🔄 重新計算', data: 'action=overload_restart' },
            },
            {
                type: 'button',
                style: 'link',
                action: { type: 'postback', label: '🏠 回主選單', data: 'action=restart' },
            }
        ],
    };

    return createBubble('🚛 超載計算結果', null, contents, footer);
};

module.exports = {
    createBubble,
    createMenu,
    createSelection,
    createResult,
    createOverloadResult
};
