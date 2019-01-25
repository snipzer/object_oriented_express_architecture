const BaseService = require('./BaseService');
const UserDto = require('../dto/UserDto');
const DtoUtil = require('../util/DtoUtil');
const AccessGranted = require('../middleware/AccessGranted');
const BcryptUtils = require('../util/BcryptUtil');
const RightEnum = require('../enum/RightEnum');

class UserService extends BaseService {
    constructor(daos, logger) {
        super(logger);
        this.dao = daos.user;
    }

    getUserById(userId, session) {
        return new Promise((resolve, reject) => {
            const isSelfRequestor = session.user.id === userId;
            const isNotUserOrReferee = session.user.role !== RightEnum.USER.name && session.user.role !== RightEnum.REFEREE.name;
            if (isSelfRequestor || isNotUserOrReferee) {
                this.dao.getById(userId).then((user) => {
                    if (user !== null) {
                        resolve(new UserDto(user));
                    } else {
                        reject(new Error(`User not found with id ${user}`));
                    }
                }).catch(err => reject(err));
            } else {
                reject(new Error('You do not have sufficient right.'));
            }
        });
    }

    getAllUser(session) {
        return new Promise((resolve, reject) => {
            const isNotUserOrReferee = session.user.role !== RightEnum.USER.name && session.user.role !== RightEnum.REFEREE.name;
            if (isNotUserOrReferee) {
                this.dao.findAll()
                    .then(users => resolve(DtoUtil.createListUserDto(users)))
                    .catch(err => reject(err));
            } else {
                reject(new Error('You do not have sufficient right.'));
            }
        });
    }

    deleteUser(userId, session) {
        return new Promise((resolve, reject) => {
            this.dao.getById(userId).then((user) => {
                const isSelfRemoving = userId === session.user.id;
                if (!isSelfRemoving) {
                    this._userNotSelfRemovingProcess(session, user, reject, resolve);
                } else {
                    this._removeUser(user, resolve, reject);
                }
            }).catch(() => reject(new Error('User not found')));
        });
    }

    _userNotSelfRemovingProcess(session, user, reject, resolve) {
        const isRequestorSuperAdmin = session.user.role === RightEnum.SUPER_ADMIN.name;
        const isRequestorAdmin = session.user.role === RightEnum.ADMIN.name;
        if (isRequestorSuperAdmin) {
            this._checkRemoveUserSuperAdmin(user, reject, resolve);
        } else if (isRequestorAdmin) {
            this._checkRemoveUserAdmin(user, reject, resolve);
        } else {
            reject(new Error('You can\'t delete other account.'));
        }
    }

    _checkRemoveUserAdmin(user, reject, resolve) {
        if (user.role > RightEnum.REFEREE.id) {
            reject(new Error('You can\'t delete admin or super admin account.'));
        } else {
            this._removeUser(user, resolve, reject);
        }
    }

    _checkRemoveUserSuperAdmin(user, reject, resolve) {
        if (user.role === RightEnum.SUPER_ADMIN.id) {
            reject(new Error('You can\'t kill a god.'));
        } else {
            this._removeUser(user, resolve, reject);
        }
    }

    _removeUser(user, resolve, reject) {
        this.dao.deleteById(user.id).then(() => {
            resolve('User has been successfully deleted !');
        }).catch(err => reject(err));
    }

    register(userInformations) {
        return new Promise((resolve, reject) => {
            this.dao.insert(userInformations)
                .then(user => resolve(new UserDto(user)))
                .catch(err => reject(err));
        });
    }

    changeUserRight(userId, roleId, session) {
        return new Promise((resolve, reject) => {
            this.dao.getById(userId).then((user) => {
                if (session.user.role === RightEnum.SUPER_ADMIN.name) {
                    this._godProcess(user, roleId, reject, resolve);
                } else if (session.user.role === RightEnum.ADMIN.name) {
                    this._adminProcess(user, roleId, reject, resolve);
                } else {
                    reject(new Error('You have not sufficient right.'));
                }
            }).catch(err => reject(err));
        });
    }

    _godProcess(user, roleId, reject, resolve) {
        if (user.role === RightEnum.SUPER_ADMIN.id || roleId === RightEnum.SUPER_ADMIN.id) {
            reject(new Error('Super admin know what they can or can\'t do.'));
        } else {
            this._changeRightProcess(user, roleId, resolve, reject);
        }
    }

    _adminProcess(user, roleId, reject, resolve) {
        if (user.role === RightEnum.SUPER_ADMIN.id || user.role === RightEnum.ADMIN.id || roleId === RightEnum.SUPER_ADMIN.id || roleId === RightEnum.ADMIN.id) {
            reject(new Error('Only super admin can do such things.'));
        } else {
            this._changeRightProcess(user, roleId, resolve, reject);
        }
    }

    _changeRightProcess(user, roleId, resolve, reject) {
        this.dao.update({ id: user.id, role: roleId })
            .then(rowCount => resolve(rowCount))
            .catch(err => reject(err));
    }

    updateUser(req) {
        return new Promise((resolve, reject) => {
            if (this._checkUpdateUser(req)) {
                this._checkUserDiff(req).then((filteredUser) => {
                    this.dao.update(filteredUser)
                        .then(rowAffected => resolve(rowAffected))
                        .catch(err => reject(err));
                }).catch(err => reject(err));
            } else {
                reject(new Error('Only administrator can update other users.'));
            }
        });
    }

    _checkUserDiff(req) {
        return new Promise((resolve, reject) => {
            this.dao.getById(req.body.userId).then((user) => {
                if (user === null) {
                    reject(new Error('User not found.'));
                } else {
                    resolve(this._calculateUserDiff(user, req));
                }
            }).catch(err => reject(err));
        });
    }

    _calculateUserDiff(user, req) {
        const userChange = {};
        userChange.id = req.body.userId;
        userChange.pseudo = req.body.pseudo;
        userChange.email = req.body.email;
        return userChange;
    }

    _checkUpdateUser(req) {
        const isSelfUpdate = parseInt(req.body.userId, 10) === req.session.user.id;
        const isAdmin = req.session.user.role === RightEnum.ADMIN.name || req.session.user.role === RightEnum.SUPER_ADMIN.name;
        return isSelfUpdate || isAdmin;
    }

    findUsersByPseudo(pseudo) {
        return new Promise((resolve, reject) => {
            this.dao.findUsersByPseudo(pseudo)
                .then(users => resolve(DtoUtil.createListUserDto(users)))
                .catch(err => reject(err));
        });
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            this.dao.getOneByMail(email).then((user) => {
                if (user == null) {
                    reject(new Error('Wrong credential'));
                } else {
                    this._checkPassword(user, password, resolve, reject);
                }
            }).catch(err => reject(err));
        });
    }

    _checkPassword(user, password, resolve, reject) {
        BcryptUtils.validPassword(user.password, password).then((isSame) => {
            if (isSame) {
                const generatedToken = AccessGranted.generateToken(user.id);
                resolve({ user: new UserDto(user), token: generatedToken });
            } else {
                reject(new Error('Wrong credential'));
            }
        }).catch(err => reject(err));
    }

    changePassword(email, oldPassword, newPassword) {
        return new Promise((resolve, reject) => {
            this.dao.getOneByMail(email).then((user) => {
                if (user === null) {
                    reject(new Error('User not found'));
                } else {
                    BcryptUtils.validPassword(user.password, oldPassword).then((isSame) => {
                        if (isSame) {
                            BcryptUtils.generatePassword(newPassword).then((hash) => {
                                user.password = hash;
                                user.save()
                                    .then(() => resolve('Done.'))
                                    .catch(err => reject(err));
                            }).catch(err => reject(new Error(err)));
                        } else {
                            reject(new Error('Password don\'t match'));
                        }
                    }).catch(err => reject(err));
                }
            }).catch(err => reject(new Error(err)));
        });
    }
}

module.exports = UserService;
