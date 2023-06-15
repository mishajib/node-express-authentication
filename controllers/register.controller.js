const bcrypt      = require('bcrypt');
const User        = require('../models/user');
const transporter = require('../config/mail');

const index = (req, res) => {
    return res.render('auth/register', {title: 'Register'});
};

const register = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;

        const user             = await User.create({
            name,
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });
        req.session.authUser   = user;
        req.session.isLoggedIn = true;

        // Render the email template
        res.render('emails/register_mail', {title: 'Email', user, password}, (err, renderedContent) => {
            if (err) throw err;

            // Set up the email content
            const mailOptions = {
                from   : 'express_auth@app.lcl',
                to     : user.email,
                subject: 'Registration Successful',
                html   : renderedContent
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
            });
        });

        req.flash('successMsg', 'User registered successfully.');

        return res.redirect('/dashboard');
    } catch (e) {
        console.log(e.message)
        req.flash('errorSingleMsg', 'Something went wrong, Please try again!');

        return res.redirect('back');
    }
};

module.exports = {
    index,
    register
};