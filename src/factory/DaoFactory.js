const BaseFactory = require('./BaseFactory');
const UserDao = require('../dao/UserDao');

/**
 * Here we instanciate the daos
 */
class DaoFactory extends BaseFactory {
    static initDaos(daos, models, logger) {
        return new Promise((resolve, reject) => {
            try {
                daos.user = new UserDao(logger, models.user);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = DaoFactory;
