const BaseController = require('./BaseController');
const AccessGranted = require('../middleware/AccessGranted');

class ViewController extends BaseController {
    registerRoutes() {
        this.router.route('/').get(AccessGranted.public, this.index.bind(this));
        this.router.route('/toto').get(AccessGranted.public, this.toto.bind(this));
    }

    index(req, res) {
        res.render('index');
    }

    toto(req, res) {
        res.render('toto');
    }
}

module.exports = ViewController;
