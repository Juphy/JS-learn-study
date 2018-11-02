let {sequelize} = require('./mysql');
const Sequelize = require('sequelize');
const user = sequelize.define('users', {
    name: {
        type: Sequelize.STRING
    },
    nick_name: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.INTEGER
    },
    password: {
        type: Sequelize.STRING
    },
    create_time: {
        type: Sequelize.DATE
    },
    invalid: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false,
    tableName: 'ads',
    freezeTableName: true
});
user.sync().then(() => {

});
module.exports = {
    'manager': user
};
