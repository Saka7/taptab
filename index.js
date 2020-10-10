const {promisify} = require('util');
const {exec} = require('child_process');
const {readFile} = require('fs').promises;
const path = require('path');

const gpioEmitter = require('./src/gpioEmitter');
const tapListener = require('./src/tapListener');

const CONFIG_FILE = process.env.CONFIG_FILE || path.join(__dirname, './taptab.rc');

async function main() {
    const file = await readFile(CONFIG_FILE, 'utf-8');
    const patterns = file
        .split('\n')
        .map(l => l.trim())
        .filter(line => !!line)
        .reduce((acc, line) => {
            const pattern = line.substring(0, line.indexOf('=')).toUpperCase();
            const command = line.substring(line.indexOf('=') + 1);
            return {...acc, [pattern]: {command}};
        }, {});

    while(true) {
        const pattern = await promisify(tapListener)(gpioEmitter);
        const detectedPattern = patterns[pattern];
        if (detectedPattern) {
            const {stdout, stderr} = await promisify(exec)(detectedPattern.command);
            if (stderr) {
                console.error(stderr);
            } else {
                console.log(stdout);
            }
        }
    }
}

main();
