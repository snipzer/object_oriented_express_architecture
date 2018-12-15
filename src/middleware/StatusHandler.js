class StatusHandler {
    constructor() {
        this.ok = 200;
        this.created = 201;
        this.noContent = 204;
        this.badRequest = 400;
        this.unauthorized = 401;
        this.forbidden = 403;
        this.notFound = 404;
        this.methodNotAllowed = 405;
        this.internalServerError = 500;
    }

    handleError(err, req, res, next) {
        this.logger.error(err);
        if (process.env.ENV === 'development') {
            next(err);
        } else {
            res.status(this.internalServerError).send();
        }
    }

    handleStatusCode(req, res, next) {
        switch (req.method) {
        case 'GET':
        case 'PATCH':
        case 'PUT':
            res.status(this.ok);
            break;
        case 'POST':
            res.status(this.created);
            break;
        case 'DELETE':
            res.status(this.noContent);
            break;
        default:
            res.status(this.methodNotAllowed);
            break;
        }
        next();
    }

    sendJson(res, status, data) {
        data = data || {};
        res.status(status);
        res.json(data);
    }
}

module.exports = StatusHandler;
