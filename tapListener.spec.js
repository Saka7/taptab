const EventEmitter = require('events');
const {strictEqual: equal} = require('assert');
const tapListener = require('./tapListener');

const ONE_TICK_MS = 3;

const noTaps = () => {
    const ee = new EventEmitter();
    setInterval(() => ee.emit('gpio', 0), ONE_TICK_MS);
    return ee;
}

const oneShortTap = () => {
    const ee = new EventEmitter();
    const trueInterval = setInterval(() => ee.emit('gpio', 1), ONE_TICK_MS);
    setTimeout(() => {
        clearInterval(trueInterval);
        setInterval(() => ee.emit('gpio', 0), ONE_TICK_MS);
    }, ONE_TICK_MS * 9);
    return ee;
};

const oneLongTap = () => {
    const ee = new EventEmitter();
    const trueInterval = setInterval(() => ee.emit('gpio', 1), ONE_TICK_MS);
    setTimeout(() => {
        clearInterval(trueInterval);
        setInterval(() => ee.emit('gpio', 0), ONE_TICK_MS);
    }, ONE_TICK_MS * 11);
    return ee;
};

const oneShortOneLongTap = () => {
    const ee = new EventEmitter();
    const shortInterval = setInterval(() => ee.emit('gpio', 1), ONE_TICK_MS);
    setTimeout(() => {
        clearInterval(shortInterval);
        ee.emit('gpio', 0);
        const longInterval = setInterval(() => {
            ee.emit('gpio', 1)
        }, ONE_TICK_MS);

        setTimeout(() => {
            clearInterval(longInterval);
            setInterval(() => ee.emit('gpio', 0), ONE_TICK_MS);
        }, 11 * ONE_TICK_MS)
    }, ONE_TICK_MS * 9);
    return ee;
};

describe('tapListener', () => {
    it('should not detect any taps', function (done) {
        const ee = noTaps();
        this.timeout(100000);

        tapListener(ee, (_, pattern) => {
            equal('', pattern);
            done();
        });
    });
    it('should detect one short tap', function (done) {
        const ee = oneShortTap();
        this.timeout(100000);

        tapListener(ee, (_, pattern) => {
            equal('1S', pattern);
            done();
        });
    });

    it('should detect one long tap', function (done) {
        const ee = oneLongTap();
        this.timeout(100000);

        tapListener(ee, (_, pattern) => {
            equal('1L', pattern);
            done();
        });
    });

    it('should detect one short and one long tap', function (done) {
        const ee = oneShortOneLongTap();
        this.timeout(100000);

        tapListener(ee, (_, pattern) => {
            equal('1S1L', pattern);
            done();
        });
    });
});




