/* eslint-disable no-unused-vars */
const BaseFactory = require('./BaseFactory');
const UserController = require('../controller/UserController');

/**
 * Here we instantiate the controllers
 */
class ControllerUtil extends BaseFactory {
    static initController(app, router, services, statusHandler, logger) {
        return new Promise((resolve, reject) => {
            try {
                app.use('/', router);
                const userController = new UserController(router, services.userService, logger, statusHandler, '/api/user');
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = ControllerUtil;
