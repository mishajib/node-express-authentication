const nodemailer = require('nodemailer');

// Configure the mailer settings

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "b1c23df2b3dc70",
        pass: "eee622ee51ea27"
    }
});

module.exports = transporter;