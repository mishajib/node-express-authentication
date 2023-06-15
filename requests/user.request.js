const {body, validationResult} = require('express-validator');
const User                     = require('../models/user');
const {Op}                     = require("sequelize");
const bcrypt                   = require('bcrypt');

const validateRegister = [
    body('name').notEmpty().withMessage('Name is required!'),
    body('username').notEmpty().withMessage('Username is required!')
        .isLength({min: 4}).withMessage('Username must be at least 4 characters long!')
        .custom(async (username) => {
            const user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (user) {
                throw new Error('Username already in use!');
            }
            return true;
        }),
    body('email').notEmpty().withMessage('Email is required!')
        .isEmail().withMessage('Invalid email address!')
        .custom(async (email) => {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (user) {
                throw new Error('Email already in use!');
            }
            return true;
        }),
    body('password').notEmpty().withMessage('Password is required!')
        .isLength({min: 8}).withMessage('Password must be at least 8 characters long!'),
    body('confirm_password').notEmpty().withMessage('Confirm password is required!')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Confirm password does not match!');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors)
        if (!errors.isEmpty()) {
            const validationErrors = {};
            // Store validation errors in flash messages
            errors.array().forEach(error => {
                req.flash('errorMsg', error.msg);
                validationErrors[error.path] = error.msg;
            });

            // Store input values in flash messages or session
            req.flash('inputValues', req.body);

            // Store validation errors in flash messages or session
            req.flash('validationErrors', validationErrors);

            return res.redirect('back');
        }
        next();
    }
];

const validateLogin = [
    body('username').notEmpty().withMessage('Username or email is required!')
        .custom(async (username) => {
            const user = await User.findOne({
                where: {
                    [Op.or]: [{username: username}, {email: username}]
                }
            });
            if (!user) {
                throw new Error('Username or email is invalid!');
            }
            return true;
        }),
    body('password').notEmpty().withMessage('Password is required!')
        .custom(async (password, {req}) => {
            const user = await User.findOne({
                where: {
                    [Op.or]: [{username: req.body.username}, {email: req.body.username}]
                }
            });

            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    throw new Error('Password is invalid!');
                }
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationErrors = {};
            // Store validation errors in flash messages
            errors.array().forEach(error => {
                req.flash('errorMsg', error.msg);
                validationErrors[error.path] = error.msg;
            });

            // Store validation errors in flash messages or session
            req.flash('validationErrors', validationErrors);

            return res.redirect('back');
        }
        next();
    }
];

module.exports = {validateRegister, validateLogin};