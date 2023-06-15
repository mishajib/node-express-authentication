const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect : 'mysql', // Replace with the appropriate database dialect
    host    : 'localhost', // Replace with your database host
    username: 'root', // Replace with your database username
    password: 'toor', // Replace with your database password
    database: 'express_auth', // Replace with your database name
});

module.exports = sequelize;