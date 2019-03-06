const BaseUtil = require('./BaseUtil');


class ViewUtil extends BaseUtil {
    static getViews() {
        return {
            INDEX: {
                name: 'index',
                properties: {
                    title: 'Home',
                    test: 50,
                }
            },
        };
    }
}

module.exports = ViewUtil;
