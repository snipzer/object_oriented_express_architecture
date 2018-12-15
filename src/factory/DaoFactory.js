const BaseFactory = require('./BaseFactory');
const UserDao = require('../dao/UserDao');

/**
 * Here we instanciate the daos
 */
class DaoFactory extends BaseFactory {
    static initDaos(daos, models, logger) {
        return new Promise((resolve, reject) => {
            try {
                daos.userDao = new UserDao(logger, models.userModel);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = DaoFactory;
