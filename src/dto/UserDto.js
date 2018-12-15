const RightEnum = require('../enum/RightEnum');

class UserDto {
    constructor(user) {
        this.id = user.id;
        this.pseudo = user.pseudo;
        this.email = user.email;
        this.role = RightEnum.getById(user.role).name;
        this.teams = user.teams;
    }
}

module.exports = UserDto;
