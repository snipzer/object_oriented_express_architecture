/* eslint-disable no-unused-vars */
const BaseFactory = require('./BaseFactory');
const ViewController = require('../controller/ViewController');
const UserController = require('../controller/UserController');

/**
 * Here we instantiate the controllers
 */
class ControllerUtil extends BaseFactory {
    static initController(app, router, services, statusHandler, logger) {
        return new Promise((resolve, reject) => {
            try {
                app.use('/', router);
                const viewController = new ViewController(router, null, logger, statusHandler, '');
                const userController = new UserController(router, services.user, logger, statusHandler, '/api/user');
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = ControllerUtil;
