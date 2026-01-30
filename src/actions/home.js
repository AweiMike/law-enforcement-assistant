const { createMenu } = require('../utils/flex');

module.exports = async function HandleHome(context) {
    // Check if it's potentially a postback for "restart"
    if (context.event.isPostback && context.event.payload.includes('action=restart')) {
        // Just fall through to show menu
    }

    await context.replyFlex('執法小幫手主選單', createMenu());
};
