const mysql = require('mysql');
const {database} = require('./config');
const Sequelize = require('sequelize');

const pool = mysql.createPool({
    host: database.HOST,
    user: database.USERNAME,
    password: database.PASSWORD,
    database: database.DATABASE
});

const sequelize = new Sequelize(database.DATABASE, database.USERNAME, database.PASSWORD, {
    host: database.HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    sequelize
};
