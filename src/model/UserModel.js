const Sequelize = require('sequelize');
const BaseModel = require('./BaseModel');
const RightEnum = require('../enum/RightEnum');
const BcryptUtil = require('../util/BcryptUtil');

class UserModel extends BaseModel {
    createModel() {
        this.model = this.sequelize.define(this.modelName, {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            pseudo: {
                type: Sequelize.STRING,
                validate: {
                    isUnique: (value, next) => {
                        const self = this;
                        this.model.find({
                            attributes: ['pseudo', 'id'],
                            where: { pseudo: value }
                        }).then((user) => {
                            if (user && self.id !== user.id) {
                                return next('Pseudo already in use !');
                            }
                            return next();
                        }).catch(err => next(err));
                    }
                }
            },
            email: {
                type: Sequelize.STRING,
                validate: {
                    isEmail: {
                        msg: 'L\'adresse email n\'est pas valide.',
                    },
                    isUnique: (value, next) => {
                        const self = this;
                        this.model.find({
                            attributes: ['email', 'id'],
                            where: { email: value }
                        }).then((user) => {
                            if (user && self.id !== user.id) {
                                return next('Email already in use !');
                            }
                            return next();
                        }).catch(err => next(err));
                    }
                },
            },
            password: Sequelize.STRING,
            city: Sequelize.STRING,
            role: Sequelize.INTEGER,
        });
        this.model.beforeCreate((user) => {
            return BcryptUtil.generatePassword(user.password)
                .then((hash) => {
                    user.password = hash;
                    user.role = RightEnum.USER.id;
                })
                .catch((err) => {
                    throw new Error(err);
                });
        });
    }
}

module.exports = UserModel;
