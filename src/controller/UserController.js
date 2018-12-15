const BaseController = require('./BaseController');
const AccessGranted = require('../middleware/AccessGranted');

class UserController extends BaseController {
    registerRoutes(routePreffix) {
        this.router.route('/login').post(AccessGranted.public, this.login.bind(this));
        this.router.route('/register').post(AccessGranted.public, this.register.bind(this));
        this.router.route(`${routePreffix}`).get(AccessGranted.restricted, this.getAllUser.bind(this));
        this.router.route(`${routePreffix}/:userId`).get(AccessGranted.restricted, this.getUserById.bind(this));
        this.router.route(`${routePreffix}/update`).post(AccessGranted.restricted, this.updateUser.bind(this));
        this.router.route(`${routePreffix}/password`).post(AccessGranted.restricted, this.changePassword.bind(this));
        this.router.route(`${routePreffix}/:userId`).delete(AccessGranted.restricted, this.deleteUser.bind(this));
        this.router.route(`${routePreffix}/find`).post(AccessGranted.restricted, this.findUsersByPseudo.bind(this));
        this.router.route(`${routePreffix}/admin/right`).post(AccessGranted.restricted, this.changeUserRight.bind(this));
    }

    getUserById(req, res) {
        if (req.params.userId !== undefined && this.checkSession(req.session)) {
            this.service.getUserById(parseInt(req.params.userId, 10), req.session)
                .then(userDto => this.statusHandler.sendJson(res, this.statusHandler.ok, userDto))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.internalServerError, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    getAllUser(req, res) {
        if (this.checkSession(req.session)) {
            this.service.getAllUser(req.session)
                .then(usersDto => this.statusHandler.sendJson(res, this.statusHandler.ok, usersDto))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.internalServerError, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    deleteUser(req, res) {
        if (req.params.userId !== undefined && this.checkSession(req.session)) {
            this.service.deleteUser(parseInt(req.params.userId, 10), req.session)
                .then(msg => this.statusHandler.sendJson(res, this.statusHandler.ok, msg))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.unauthorized, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    changeUserRight(req, res) {
        if (req.body.userId !== undefined && req.body.roleId !== undefined && this.checkSession(req.session)) {
            this.service.changeUserRight(parseInt(req.body.userId, 10), parseInt(req.body.roleId, 10), req.session)
                .then(userDto => this.statusHandler.sendJson(res, this.statusHandler.ok, userDto))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.unauthorized, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    updateUser(req, res) {
        if (req.body.userId !== undefined && req.body.pseudo !== undefined && req.body.email !== undefined && this.checkSession(req.session)) {
            this.service.updateUser(req)
                .then(userDto => this.statusHandler.sendJson(res, this.statusHandler.ok, userDto))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.unauthorized, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    register(req, res) {
        if (req.body.pseudo !== undefined && req.body.email !== undefined && req.body.password !== undefined) {
            this.service.register(req.body)
                .then(userDto => this.statusHandler.sendJson(res, this.statusHandler.ok, userDto))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.internalServerError, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    findUsersByPseudo(req, res) {
        if (req.body.pseudo !== undefined) {
            this.service.findUsersByPseudo(req.body.pseudo)
                .then(usersDto => this.statusHandler.sendJson(res, this.statusHandler.ok, usersDto))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.unauthorized, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    login(req, res) {
        if (req.body.email !== undefined && req.body.password !== undefined) {
            this.service.login(req.body.email, req.body.password)
                .then((userAndToken) => {
                    req.session.user = userAndToken.user;
                    this.saveSession(req, userAndToken.user).then(() => {
                        this.statusHandler.sendJson(res, this.statusHandler.ok, userAndToken);
                    }).catch(err => this.statusHandler.sendJson(res, this.statusHandler.unauthorized, err.message));
                }).catch(err => this.statusHandler.sendJson(res, this.statusHandler.unauthorized, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }

    changePassword(req, res) {
        if (req.body.email !== undefined && req.body.oldPassword !== undefined && req.body.newPassword !== undefined) {
            this.service.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword)
                .then(isChanged => this.statusHandler.sendJson(res, this.statusHandler.ok, isChanged))
                .catch(err => this.statusHandler.sendJson(res, this.statusHandler.internalServerError, err.message));
        } else {
            this.sendMissingParameters(res);
        }
    }
}

module.exports = UserController;
