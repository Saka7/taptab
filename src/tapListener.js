const {TicksList} = require('./ticksList');

const RESET_INTERVAL_TICKS = process.env.RESET_INTERVAL_TICKS || 100;

const tapListener = (ee, cb) => {
    const ticks = new TicksList();
    ee.on('gpio', v => {
        ticks.push(v);
        if (!ticks.prevValue && ticks.falseCount >= RESET_INTERVAL_TICKS) {
            ticks.flush();
            cb(null, ticks.pattern);
            ticks.reset();
            ee.removeAllListeners();
        }
    });
};

module.exports = tapListener;
