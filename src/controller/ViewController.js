const BaseController = require('./BaseController');
const AccessGranted = require('../middleware/AccessGranted');
const ViewUtil = require('../util/ViewUtil');

class ViewController extends BaseController {
    registerRoutes() {
        this.router.route('/').get(AccessGranted.public, this.index.bind(this));
    }

    index(req, res) {
        const index = ViewUtil.getViews().INDEX;
        res.render(index.name, index.properties);
    }
}

module.exports = ViewController;
