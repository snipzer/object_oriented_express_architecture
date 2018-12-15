
class BaseEnum {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    toString() {
        return this.name;
    }

    static checkIfExists(id) {
        if (id >= 0 && id <= 3) {
            return true;
        }
        throw new Error(`State with id: ${id} don't exists.`);
    }
}

module.exports = BaseEnum;
