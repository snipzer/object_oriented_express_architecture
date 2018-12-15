const BaseUtil = require('./BaseUtil');
const UserDto = require('../dto/UserDto');

class DtoUtils extends BaseUtil {
    static createListUserDto(users) {
        const usersDto = [];
        if (users == null) return [{}];
        users.forEach(user => usersDto.push(new UserDto(user)));
        return usersDto;
    }
}

module.exports = DtoUtils;
