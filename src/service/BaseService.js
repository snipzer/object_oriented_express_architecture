class BaseService {
    constructor(logger) {
        this.logger = logger;
        this.logger.info(`Instanciating ${this.constructor.name}...`);
    }
}

module.exports = BaseService;
