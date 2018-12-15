const BaseDao = require('./BaseDao');

class UserDao extends BaseDao {
    getOneByMail(mail) {
        return this.model.findOne({
            where: {
                email: mail,
            }
        });
    }

    findUsersByPseudo(pseudo) {
        return this.model.findAll({
            where: {
                pseudo: {
                    [this.op.like]: `%${pseudo}%`
                }
            }
        });
    }
}

module.exports = UserDao;
