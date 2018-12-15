
class BaseModel {
    constructor(sequelize, logger, modelName) {
        this.sequelize = sequelize;
        this.modelName = modelName;
        this.logger = logger;
        this.model = null;
        this.logger.info(`Instanciating ${this.modelName}Model...`);
        this.createModel();
    }

    getModel() {
        return this.model;
    }

    createModel() {}
}

module.exports = BaseModel;
