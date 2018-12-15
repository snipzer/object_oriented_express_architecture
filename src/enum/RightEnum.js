const BaseEnum = require('./BaseEnum');

class RightEnum extends BaseEnum {
}

RightEnum.USER = new RightEnum(0, 'USER');
RightEnum.REFEREE = new RightEnum(1, 'REFEREE');
RightEnum.ADMIN = new RightEnum(2, 'ADMIN');
RightEnum.SUPER_ADMIN = new RightEnum(3, 'SUPER_ADMIN');

RightEnum.getById = (id) => {
    switch (id) {
    case 0:
        return RightEnum.USER;
    case 1:
        return RightEnum.REFEREE;
    case 2:
        return RightEnum.ADMIN;
    case 3:
        return RightEnum.SUPER_ADMIN;
    default:
        throw new Error(`Right n°${id} doesn't exist`);
    }
};

module.exports = RightEnum;
