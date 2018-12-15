const configSequelize = {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    operatorsAliases: false,
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    },
};

module.exports = configSequelize;

