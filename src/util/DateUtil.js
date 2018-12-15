const moment = require('moment');
const BaseUtil = require('./BaseUtil');


class BcryptUtil extends BaseUtil {
    static getDateByLabel(label) {
        return moment(label, 'DD/MM/YYYY').toDate();
    }

    static getLabelByDate(date) {
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());
        if (month.length < 2) {
            month = `0${month}`;
        }
        if (day.length < 2) {
            day = `0${day}`;
        }
        return `${day}/${month}/${year}`;
    }
}

module.exports = BcryptUtil;
