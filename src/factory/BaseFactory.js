class BaseFactory {
    constructor() {
        throw new Error('Do not instantiate a factory !');
    }
}

module.exports = BaseFactory;
