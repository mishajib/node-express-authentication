const bcrypt = require('bcrypt');
const User   = require('../models/user');
const {Op}   = require("sequelize");

const index = (req, res) => {
    return res.render('auth/login', {title: 'Login'});
};

const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({
            where: {
                [Op.or]: [{username: username}, {email: username}]
            }
        });

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.authUser   = user;
                req.session.isLoggedIn = true;

                req.flash('successMsg', 'User logged in successfully.');

                return res.redirect('/dashboard');
            }
        }

        req.flash('errorSingleMsg', 'Invalid login credentials.');

        return res.redirect('back');
    } catch (e) {
        req.flash('errorSingleMsg', 'Something went wrong, Please try again!');

        return res.redirect('back');
    }
};

const logout = async (req, res) => {
    req.flash('successMsg', 'User logged out successfully.');

    req.session.destroy();

    return res.redirect('/login');
};

module.exports = {
    index,
    login,
    logout
};