const HandleOverload = require('../src/actions/overload');

// Mock Data
const theme = { colors: {} }; // Mock theme if needed, though HandleOverload imports it.

// Simple Test Runner
async function runTests() {
    let passed = 0;
    let failed = 0;

    const test = async (name, fn) => {
        try {
            await fn();
            // console.log(`✅ [PASS] ${name}`); // Verbose
            process.stdout.write('.');
            passed++;
        } catch (e) {
            console.error(`\n❌ [FAIL] ${name}`);
            console.error(e);
            failed++;
        }
    };

    const expect = (actual) => ({
        toBe: (expected) => {
            if (actual !== expected) throw new Error(`Expected ${expected}, but got ${actual}`);
        }
    });

    const createMockContext = (overloadState) => {
        const state = { overload: overloadState };
        return {
            state: state,
            event: { payload: '', isText: true, text: 'dummy' },
            setState: (newState) => {
                if (newState.overload) {
                    Object.assign(state.overload, newState.overload);
                }
            },
            replyFlex: jestMockReplyFlex,
            replyText: () => { }
        };
    };

    let mockReplyBubble = null;
    const jestMockReplyFlex = (altText, bubble) => {
        mockReplyBubble = bubble;
    };

    const parseResultData = (bubble) => {
        if (!bubble || !bubble.body || !bubble.body.contents) return { status: 'Error', fine: -1 };
        const bodyContents = bubble.body.contents;
        const status = bodyContents[0].text;

        let fine = 0;
        const fineBox = bodyContents.find(c => c.type === 'box' && c.contents[0].text === '預估罰鍰');
        if (fineBox) {
            const fineText = fineBox.contents[1].text;
            fine = parseInt(fineText.replace('$', '').replace(/,/g, ''));
        }
        return { status, fine };
    };

    console.log('Running Overload Calculator Tests...');

    // === Test Cases ===

    await test('No Overload (35/35)', async () => {
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'general', authorized: 35 });
        context.event.text = '35';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(status).toBe('未超載');
        expect(fine).toBe(0);
    });

    await test('Tolerance 10% (35/38)', async () => {
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'general', authorized: 35 });
        context.event.text = '38';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(status).toBe('勸導免罰');
        expect(fine).toBe(0);
    });

    await test('Indivisible (Small) - Auth 3.5 / Act 5', async () => {
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'indivisible_no_pass', authorized: 3.5 });
        context.event.text = '5';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(fine).toBe(3000);
    });

    await test('Indivisible (Large) - Auth 3.51 / Act 5', async () => {
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'indivisible_no_pass', authorized: 3.51 });
        context.event.text = '5';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(fine).toBe(4500);
    });

    await test('General L1: Auth 35 / Act 40.2 (Diff 5.2 -> 6)', async () => {
        // Countable 6. Level 1 (<=10). Rate 1000.
        // Fine = 10000 + 6 * 1000 = 16000.
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'general', authorized: 35 });
        context.event.text = '40.2';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(fine).toBe(16000);
    });

    await test('General L2: Auth 35 / Act 47 (Diff 12)', async () => {
        // Countable 12. Level 2 (11-20). Rate 2000.
        // Fine = 10000 + 12 * 2000 = 34000.
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'general', authorized: 35 });
        context.event.text = '47';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(fine).toBe(34000);
    });

    await test('General L3: Auth 35 / Act 60 (Diff 25)', async () => {
        // Countable 25. Level 3 (21-30). Rate 3000.
        // Fine = 10000 + 25 * 3000 = 10000 + 75000 = 85000.
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'general', authorized: 35 });
        context.event.text = '60';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(fine).toBe(85000);
    });

    await test('General L4: Auth 35 / Act 70 (Diff 35)', async () => {
        // Countable 35. Level 4 (>30). Rate 5000.
        // Fine = 10000 + 35 * 5000 = 10000 + 175000 = 185000.
        mockReplyBubble = null;
        const context = createMockContext({ step: 'input_actual', type: 'general', authorized: 35 });
        context.event.text = '70';
        await HandleOverload(context);
        const { status, fine } = parseResultData(mockReplyBubble);
        expect(fine).toBe(185000);
    });

    console.log(`\n\nDone: ${passed} Passed, ${failed} Failed.`);
    if (failed > 0) process.exit(1);
}

runTests();
