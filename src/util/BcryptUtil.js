const bcrypt = require('bcrypt-nodejs');
const BaseUtil = require('./BaseUtil');

class BcryptUtil extends BaseUtil {
    static validPassword(hash, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    static generatePassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, bcrypt.genSaltSync(10), null, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    }
}

module.exports = BcryptUtil;
