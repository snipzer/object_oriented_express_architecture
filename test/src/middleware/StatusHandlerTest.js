const expect = require('expect');
const Mocha = require('mocha');
const StatusHandler = require('../../../src/middleware/StatusHandler');

Mocha.describe('HttpStatusService', () => {
    Mocha.it('Should return 200 for ok', () => {
        const statusHandler = new StatusHandler();
        expect(statusHandler.ok).toBe(200);
    });
});
