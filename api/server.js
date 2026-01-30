const { bottender } = require('bottender');

const bot = bottender({
    dev: process.env.NODE_ENV !== 'production',
});

const handle = bot.createRequestHandler();

module.exports = async (req, res) => {
    await bot.prepare();
    return handle(req, res);
};
