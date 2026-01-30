const { router, text, route } = require('bottender/router');

// Actions (Will be created next)
const HandleHome = require('./actions/home');
const HandleUnlicensed = require('./actions/unlicensed');
const HandleDrunk = require('./actions/drunk');
const HandleYield = require('./actions/yield');
const HandleOthers = require('./actions/others');

// Simple router to delegate based on payload
// For complex flows, individual actions will handle their own state
async function App(context) {
    return router([
        // Home / Reset
        text(['hi', 'hello', '開始', 'menu', '主選單'], HandleHome),
        route(context => context.event.isPostback && context.event.payload === 'action=restart', HandleHome),

        // Module 1: Unlicensed
        route(context => context.event.isPostback && context.event.payload.startsWith('module=unlicensed'), HandleUnlicensed),
        route(context => context.event.isPostback && context.event.payload.startsWith('unlicensed_'), HandleUnlicensed),

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
    ]);
}

module.exports = App;
