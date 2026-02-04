const theme = require('../utils/theme');
const flex = require('../utils/flex');

const OVERLOAD_STATES = {
    INIT: 'init',
    SELECT_TYPE: 'select_type',
    INPUT_AUTHORIZED: 'input_authorized',
    INPUT_ACTUAL: 'input_actual',
    RESULT: 'result'
};

async function HandleOverload(context) {
    // Initialize State
    if (!context.state.overload) {
        context.setState({
            overload: {
                step: OVERLOAD_STATES.INIT,
                type: null,
                authorized: null,
                actual: null
            }
        });
    }

    const { payload } = context.event;

    // Route based on action
    if (payload && (payload === 'module=overload' || payload === 'action=overload_restart')) {
        return await askType(context);
    }

    if (payload && payload.startsWith('overload_type=')) {
        const type = payload.split('=')[1];
        context.setState({
            overload: {
                ...context.state.overload,
                step: OVERLOAD_STATES.INPUT_AUTHORIZED,
                type: type
            }
        });
        return await context.replyText('請輸入「核定總重」 (公噸)\n例如：3.5 或 35');
    }

    // Handle Text Input for Weights
    if (context.event.isText) {
        const text = context.event.text.trim();
        const value = parseFloat(text);

        if (isNaN(value) || value <= 0) {
            return await context.replyText('⚠️ 請輸入有效的數字 (例如: 35)');
        }

        const currentStep = context.state.overload.step;

        if (currentStep === OVERLOAD_STATES.INPUT_AUTHORIZED) {
            context.setState({
                overload: {
                    ...context.state.overload,
                    step: OVERLOAD_STATES.INPUT_ACTUAL,
                    authorized: value
                }
            });
            return await context.replyText('請輸入「實際總重」 (公噸)\n例如：45.5');
        }

        if (currentStep === OVERLOAD_STATES.INPUT_ACTUAL) {
            context.setState({
                overload: {
                    ...context.state.overload,
                    step: OVERLOAD_STATES.RESULT,
                    actual: value
                }
            });
            return await calculateAndShowResult(context);
        }
    }
}

async function askType(context) {
    context.setState({
        overload: {
            step: OVERLOAD_STATES.SELECT_TYPE,
            type: null,
            authorized: null,
            actual: null
        }
    });

    const bubble = flex.createBubble(
        '🚛 貨物種類選擇',
        '請選擇載運貨物類型',
        [
            {
                type: 'button',
                style: 'primary',
                action: { type: 'postback', label: '📦 一般貨物 (預設)', data: 'overload_type=general' },
                margin: 'sm'
            },
            {
                type: 'button',
                style: 'secondary',
                action: { type: 'postback', label: '🏗️ 整體物品 (未領證)', data: 'overload_type=indivisible_no_pass' },
                margin: 'sm'
            },
            {
                type: 'button',
                style: 'secondary',
                action: { type: 'postback', label: '🎫 整體物品 (已領證)', data: 'overload_type=indivisible_pass' },
                margin: 'sm'
            }
        ],
        {
            type: 'box',
            layout: 'vertical',
            contents: [
                {
                    type: 'button',
                    style: 'link',
                    action: { type: 'postback', label: '🏠 回主選單', data: 'action=restart' }
                }
            ]
        }
    );

    await context.replyFlex('選擇貨物種類', bubble);
}

async function calculateAndShowResult(context) {
    const { type, authorized, actual } = context.state.overload;

    const overloadWeight = actual - authorized;
    const overloadPercent = overloadWeight / authorized; // 0.1 = 10%

    let result = {
        title: '超載運算結果',
        status: '正常', // 正常, 勸導, 違規
        fine: 0,
        points: 0,
        action: '',
        article: '',
        details: []
    };

    // Logic Step 1: Check if overloaded
    if (overloadWeight <= 0) {
        result.status = '未超載';
        result.action = '無需處置';
        result.details.push(`未超重 (剩餘荷重: ${(overloadWeight * -1).toFixed(1)} 噸)`);
    }
    // Logic Step 2: Tolerance (10%)
    else if (overloadPercent <= 0.1) {
        result.status = '勸導免罰';
        result.fine = 0;
        result.action = '得施以勸導，免予舉發';
        result.details.push(`超載 ${overloadWeight.toFixed(2)} 噸 (未逾 10%)`);
        result.article = '處理細則第12條第13款';
    }
    else {
        // Step 3 & 4: Calculate Fine
        result.status = '違規舉發';
        result.points = 1;

        // Disposition Rule (Common for all)
        if (overloadPercent > 0.2) {
            result.action = '🔴 當場禁止通行';
        } else {
            result.action = '🟠 責令 2 小時內分裝改正'; // 逾期得連續舉發
        }

        // Logic Step 3: Indivisible w/o Pass
        if (type === 'indivisible_no_pass') {
            result.article = '道路交通管理處罰條例第29條第1項第2款';
            // Heuristic: Auth <= 3.5 is Small, > 3.5 is Large
            // Or assume Large if not small? 
            // Usually overload cases are heavy vehicles.
            // Let's use the 3.5T cutoff strictly.
            if (authorized <= 3.5) {
                result.fine = 3000;
                result.details.push('整體物品(無證) - 小型車');
            } else {
                result.fine = 4500;
                result.details.push('整體物品(無證) - 大型車');
            }
        }
        // Logic Step 4: General (Progressive)
        else {
            result.article = '道路交通管理處罰條例第29-2條';

            const countableOverload = Math.ceil(overloadWeight);
            const baseFine = 10000;
            let rate = 0;

            // Determine Rate based on total overload (Single Rate Tier)
            if (countableOverload <= 10) {
                rate = 1000;
            } else if (countableOverload <= 20) {
                rate = 2000;
            } else if (countableOverload <= 30) {
                rate = 3000;
            } else {
                rate = 5000;
            }

            const addFine = countableOverload * rate;
            result.fine = baseFine + addFine;

            result.details.push(`計費超重: ${countableOverload} 公噸 (無條件進位)`);
            result.details.push(`基礎罰鍰: $10,000`);
            result.details.push(`加計罰鍰: ${countableOverload}t x $${rate} = $${addFine.toLocaleString()}`);
        }
    }

    // Create Flex Message
    await context.replyFlex('超載計算結果', flex.createOverloadResult(
        authorized,
        actual,
        overloadWeight,
        overloadPercent,
        result
    ));
}

module.exports = HandleOverload;
