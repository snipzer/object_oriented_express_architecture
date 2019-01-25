const expect = require('expect');
const Mocha = require('mocha');
const DateUtils = require('../../../src/util/DateUtil');

Mocha.describe('DateUtils', () => {
    Mocha.it('Should convert a javascript date to a proper string format', () => {
        const date = new Date('August 19, 1975 00:10:00');
        expect(DateUtils.getLabelByDate(date)).toBe('19/08/1975');
    });
    Mocha.it('Should convert proper formated string to a javascript date', () => {
        const date = new Date('August 19, 1975 00:00:00');
        expect(DateUtils.getDateByLabel('19/08/1975').toString()).toBe(date.toString());
    });
});
