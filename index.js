const { router, text, route } = require('bottender/router');

// Actions
const HandleHome = require('./src/actions/home');
const HandleFollow = require('./src/actions/follow');
const HandleUnlicensed = require('./src/actions/unlicensed');
const HandleDrunk = require('./src/actions/drunk');
const HandleYield = require('./src/actions/yield');
const HandleOthers = require('./src/actions/others');
const HandleTools = require('./src/actions/tools');
const HandleOverload = require('./src/actions/overload');

// Simple router to delegate based on payload
// For complex flows, individual actions will handle their own state
async function App(context) {
    return router([
        // Follow Event (User adds bot as friend)
        route(context => context.event.isFollow, HandleFollow),

        // Home / Reset
        text(['hi', 'hello', '開始', 'menu', '主選單'], HandleHome),
        route(context => context.event.isPostback && context.event.payload === 'action=restart', HandleHome),

        // Module: Overload Calculator
        route(context => context.event.isPostback && context.event.payload.startsWith('module=overload'), HandleOverload),
        route(context => context.event.isPostback && context.event.payload.startsWith('overload_'), HandleOverload),
        route(context => context.event.isPostback && context.event.payload === 'action=overload_restart', HandleOverload),
        route(context => context.event.isText && context.state.overload && (context.state.overload.step === 'input_authorized' || context.state.overload.step === 'input_actual'), HandleOverload),

        // Module: Tools (Date/Age) - Must be before text fallback
        route(context => context.event.isPostback && context.event.payload.startsWith('module=tools'), HandleTools),
        route(context => context.event.isPostback && context.event.payload.startsWith('action=tools_'), HandleTools),
        // Handle text input for Age Calculator (when state.tools.mode is 'input_age')
        route(context => context.event.isText && context.state.tools && context.state.tools.mode === 'input_age', HandleTools),

        // Module 1: Unlicensed (multi-step flow with ul_ prefix)
        route(context => context.event.isPostback && context.event.payload.startsWith('module=unlicensed'), HandleUnlicensed),
        route(context => context.event.isPostback && context.event.payload.startsWith('ul_'), HandleUnlicensed),

        // Module 2: Drunk Driving
        route(context => context.event.isPostback && context.event.payload.startsWith('module=drunk'), HandleDrunk),
        route(context => context.event.isPostback && context.event.payload.startsWith('drunk_'), HandleDrunk),

        // Module 3: Yield / Pedestrian
        route(context => context.event.isPostback && context.event.payload.startsWith('module=yield'), HandleYield),
        route(context => context.event.isPostback && context.event.payload.startsWith('yield_'), HandleYield),

        // Module 4: Others
        route(context => context.event.isPostback && context.event.payload.startsWith('module=others'), HandleOthers),
        route(context => context.event.isPostback && context.event.payload.startsWith('others_'), HandleOthers),

        // Default Fallback
        text('*', HandleHome),
        // Catch-all for any other event types (sticker, image, etc.)
        route('*', HandleHome),
    ]);
}

module.exports = App;
