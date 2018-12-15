const Sequelize = require('sequelize');

class BaseDao {
    constructor(loggerDao, model) {
        this.model = model;
        this.loggerDao = loggerDao;
        this.op = Sequelize.Op;
    }

    getList() {
        this.loggerDao.verbose(`${this.constructor.name} - ${this.getList.name}`);
        return this.model.findAll();
    }

    getObject(id) {
        this.loggerDao.verbose(`${this.constructor.name} - ${this.getObject.name}`);
        return this.model.findOne({ where: { id } });
    }

    insertObject(object) {
        this.loggerDao.verbose(`${this.constructor.name} - ${this.insertObject.name}`);
        return this.model.create(object);
    }

    updateObject(object) {
        const objectId = object.id;
        delete object.id;
        this.loggerDao.verbose(`${this.constructor.name} - ${this.updateObject.name}`);
        return this.model.update(object, { where: { id: objectId } });
    }

    deleteObject(id) {
        this.loggerDao.verbose(`${this.constructor.name} - ${this.deleteObject.name}`);
        return this.model.destroy({ where: { id } });
    }

    deleteObjectByCondition(object) {
        return this.model.destroy({ where: object });
    }
}

module.exports = BaseDao;
