const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./config/Logger');
const StatusHandler = require('./middleware/StatusHandler');
const SequelizeConnector = require('./config/SequelizeConnector');
const session = require('express-session');
const ModelFactory = require('./factory/ModelFactory');
const DaoFactory = require('./factory/DaoFactory');
const ServiceFactory = require('./factory/ServiceFactory');
const ControllerFactory = require('./factory/ControllerFactory');

class Server {
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.models = {};
        this.daos = {};
        this.services = {};
        this.setBodyParser();
        this.setPort();
        this.setSession();
        this.setStatusCodeHandler();
        this.setViewEngine();
    }

    /**
     * * Formatting Port
     */
    static normalizePort(val) {
        const port = parseInt(val, 10);
        if (typeof port !== 'number') {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }

    /**
     * * Bootstrapping Server
     */
    run() {
        logger.info('Connecting to mysql...');
        SequelizeConnector.connect(logger).then((sequelizeConnection) => {
            logger.info('Connection complete !');
            ModelFactory.initModels(sequelizeConnection, this.models, logger).then(() => {
                DaoFactory.initDaos(this.daos, this.models, logger).then(() => {
                    ServiceFactory.initServices(this.services, this.daos, logger).then(() => {
                        ControllerFactory.initController(this.app, this.router, this.services, this.statusHandler, logger).then(() => {
                            this.app.listen(this.port, () => logger.info(`Server started on port ${this.port} !`));
                        }).catch(err => logger.error(err.message));
                    }).catch(err => logger.error(err.message));
                }).catch(err => logger.error(err.message));
            }).catch(err => logger.error(err.message));
        }).catch(err => logger.error(err.message));
    }

    /**
     * * Server Port Configuration
     */
    setPort() {
        logger.info('Getting Server\'s Port...');
        this.port = Server.normalizePort(process.env.PORT || 3000);
    }

    /**
     * * Handling status code
     */
    setStatusCodeHandler() {
        this.statusHandler = new StatusHandler(logger);
        this.app.use(this.statusHandler.handleStatusCode.bind(this.statusHandler));
        this.app.use(this.statusHandler.handleError.bind(this.statusHandler));
    }

    /**
     * * Parser Configuration
     */
    setBodyParser() {
        logger.info('bodyParser configuration...');
        this.router.use(bodyParser.json());
        this.router.use(bodyParser.urlencoded({ extended: true }));
    }

    /**
     * * Session Configuration
     */
    setSession() {
        this.app.use(session({
            secret: process.env.API_TOKEN_SECRET,
            resave: true,
            saveUninitialized: true,
            cookie: {
                path: '/',
                domain: 'localhost',
                httpOnly: false,
                maxAge: new Date(2018, 0, 1).getTime(),
                secure: false,
            }
        }));
    }

    setViewEngine() {
        logger.info('Setting view engine...');
        this.app.use(express.static(path.join(__dirname, '/../public')));
        this.app.set('view engine', 'twig');
        this.app.set('views', path.join(__dirname, '../src/views/'));
    }
}

module.exports = Server;
