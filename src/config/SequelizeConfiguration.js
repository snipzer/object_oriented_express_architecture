const configSequelize = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
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

