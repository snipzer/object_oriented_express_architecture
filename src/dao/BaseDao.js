const Sequelize = require('sequelize');

class BaseDao {
    constructor(logger, model) {
        this.model = model;
        this.logger = logger;
        this.op = Sequelize.Op;
    }

    findAll() {
        this.logger.verbose(`${this.constructor.name} - ${this.findAll.name}`);
        return this.model.findAll();
    }

    getById(objectId) {
        this.logger.verbose(`${this.constructor.name} - ${this.getById.name}`);
        return this.model.findOne({ where: { id: objectId } });
    }

    findByObject(object) {
        this.logger.verbose(`${this.constructor.name} - ${this.getById.name}`);
        return this.model.findAll({ where: object });
    }

    insert(object) {
        this.logger.verbose(`${this.constructor.name} - ${this.insert.name}`);
        return this.model.create(object);
    }

    update(object) {
        this.logger.verbose(`${this.constructor.name} - ${this.update.name}`);
        const objectId = object.id;
        delete object.id;
        return this.model.update(object, { where: { id: objectId } });
    }

    deleteById(id) {
        this.logger.verbose(`${this.constructor.name} - ${this.deleteById.name}`);
        return this.model.destroy({ where: { id } });
    }

    deleteByObject(object) {
        this.logger.verbose(`${this.constructor.name} - ${this.deleteByObject().name}`);
        return this.model.destroy({ where: object });
    }
}

module.exports = BaseDao;
