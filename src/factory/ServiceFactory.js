const BaseFactory = require('./BaseFactory');
const UserService = require('../service/UserService');

/**
 * Here we instantiate the services
 */
class ServiceFactory extends BaseFactory {
    static initServices(services, daos, logger) {
        return new Promise((resolve, reject) => {
            try {
                services.user = new UserService(daos, logger);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = ServiceFactory;
