const Sequelize = require('sequelize');
const configSequelize = require('./SequelizeConfiguration');

class SequelizeConnector {
    static connect() {
        return new Promise((resolve) => {
            const sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                configSequelize
            );
            resolve(sequelize);
        });
    }
}

module.exports = SequelizeConnector;
