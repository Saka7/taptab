const {strictEqual: equal} = require('assert');
const {ticksList} = require('./ticksList');

const narr = arr => arr.reduce((acc, next) => acc.concat(Array(next).fill(true).concat([false])), []);

describe('detectPattern', () => {
    afterEach(() => ticksList.reset());

    it('should return empty pattern', () => {
        ticksList.push(false);
        ticksList.flush();
        const expectedPattern = '';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return empty pattern multiple false', () => {
        ticksList.pushAll([false, false, false, false, false]);
        const expectedPattern = '';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 1S', () => {
        ticksList.pushAll(narr([1]));
        const expectedPattern = '1S';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 1L', () => {
        ticksList.pushAll(narr([11]));
        const expectedPattern = '1L';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 2S', () => {
        ticksList.pushAll(narr([9, 9]));
        const expectedPattern = '2S';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 2L', () => {
        ticksList.pushAll(narr([11, 11]));
        const expectedPattern = '2L';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 1S1L', () => {
        ticksList.pushAll(narr([1, 11]));
        const expectedPattern = '1S1L';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 2S3L', () => {
        ticksList.pushAll(narr([9, 1, 25, 30, 11]));
        const expectedPattern = '2S3L';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 3L8S', () => {
        ticksList.pushAll(narr([11, 11, 11, 1, 1, 1, 1, 1, 1, 1, 1]));
        const expectedPattern = '3L8S';
        equal(ticksList.pattern, expectedPattern);
    });

    it('should return 8S3L', () => {
        ticksList.pushAll(narr([1, 1, 1, 1, 1, 1, 1, 1, 11, 11, 11]));
        const expectedPattern = '8S3L';
        equal(ticksList.pattern, expectedPattern);
    });
});
