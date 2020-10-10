const EventEmitter = require('events');
const {exec} = require('child_process');
const {promisify} = require('util');

const ONE_TICK_MS = process.env.ONE_TICK_MS || 30;
const GPIO_PIN = process.env.GPIO_PIN;
const ee = new EventEmitter();

setInterval(async () => {
    const {stdout} = await promisify(exec)(`gpio -g read ${GPIO_PIN}`);
    ee.emit('gpio', +stdout);
}, ONE_TICK_MS);

module.exports = ee;
