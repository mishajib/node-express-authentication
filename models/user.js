const {DataTypes} = require('sequelize');
const sequelize   = require('../config/database'); // Import the sequelize instance

const User = sequelize.define('User', {
    // Define your User model schema
    id               : {
        allowNull    : false,
        autoIncrement: true,
        primaryKey   : true,
        type         : DataTypes.BIGINT.UNSIGNED
    },
    name             : {
        type     : DataTypes.STRING,
        allowNull: false
    },
    username         : {
        type     : DataTypes.STRING,
        allowNull: false,
        unique   : true
    },
    email            : {
        type     : DataTypes.STRING,
        allowNull: false,
        unique   : true,
        validate : {
            isEmail: true
        }
    },
    email_verified_at: {
        type     : DataTypes.DATE,
        allowNull: true,
    },
    password         : {
        type     : DataTypes.STRING,
        allowNull: false
    },
    remember_token   : {
        type     : DataTypes.STRING,
        allowNull: true,
    },
    createdAt        : {
        allowNull   : false,
        type        : DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt        : {
        allowNull   : false,
        type        : DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
}, {tableName: 'users'});

// Sync the model with the database
User.sync();

module.exports = User;