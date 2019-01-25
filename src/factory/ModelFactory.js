const BaseFactory = require('./BaseFactory');
const UserModel = require('../model/UserModel');

/**
 * Here we instantiate the models
 * _init instantiate the models
 * _bindRelation add relation between tables
 * _syncModels create the tables
 */
class ModelFactory extends BaseFactory {
    static initModels(sequelizeConnection, models, logger) {
        return new Promise((resolve, reject) => {
            logger.info('Instanciating models...');
            ModelFactory._init(models, sequelizeConnection, logger).then(() => {
                logger.info('First synchronisation...');
                ModelFactory._syncModels(models).then(() => {
                    logger.info('Biding relation...');
                    ModelFactory._bindRelation(models, logger).then(() => {
                        logger.info('Last synchronisation...');
                        ModelFactory._syncModels(models).then(() => {
                            resolve();
                        }).catch(err => reject(err));
                    }).catch(err => reject(err));
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }

    static _init(models, sequelizeConnection, logger) {
        return new Promise((resolve, reject) => {
            try {
                models.user = new UserModel(sequelizeConnection, logger, 'user').getModel();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    static _bindRelation(models, logger) {
        return new Promise((resolve, reject) => {
            try {
                logger.info('No relation to bind yet');
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    static _syncModels(models) {
        return new Promise((resolve, reject) => {
            const promises = [];
            promises.push(models.user.sync());
            Promise.all(promises).then(() => {
                resolve();
            }).catch(err => reject(err));
        });
    }
}

module.exports = ModelFactory;
