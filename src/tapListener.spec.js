const EventEmitter = require('events');
const {strictEqual: equal} = require('assert');
const {promisify} = require('util');

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

describe('tapListener', function() {
    this.timeout(10000);

    it('should not detect any taps', async () => {
        const pattern = await promisify(tapListener)(noTaps());
        equal('', pattern);
    });

    it('should detect one short tap', async () => {
        const pattern = await promisify(tapListener)(oneShortTap());
        equal('1S', pattern);
    });

    it('should detect one long tap', async () => {
        const pattern = await promisify(tapListener)(oneLongTap());
        equal('1L', pattern);
    });

    it('should detect one short and one long tap', async () => {
        const pattern = await promisify(tapListener)(oneShortOneLongTap());
        equal('1S1L', pattern);
    });
});
