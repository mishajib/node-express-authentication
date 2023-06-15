const express        = require('express');
const app            = express();
const cors           = require('cors');
const flash          = require('connect-flash');
const session        = require('express-session');
const initRoutes     = require('./routes');
const {formatDate}   = require('./helpers/index.helpers');
const methodOverride = require('method-override');

global.__basedir = __dirname;

// Set EJS as the templating/view engine
app.set('view engine', 'ejs');

// Set the path to the views (template) directory
app.set('views', __dirname + '/views');

// cors setup
app.use(cors());

// body parser setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Express session middleware
app.use(session({
    secret           : 'mitoor',
    resave           : true,
    saveUninitialized: true
}));

// Connect flash middleware
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    // text/html
    res.header('Content-Type', 'text/html');
    res.locals.successMsg       = req.flash('successMsg')[0] || null;
    res.locals.errorMsg         = req.flash('errorMsg');
    res.locals.errorSingleMsg   = req.flash('errorSingleMsg')[0] || null;
    res.locals.inputValues      = req.flash('inputValues')[0] || {};
    res.locals.validationErrors = req.flash('validationErrors')[0] || {};
    res.locals.formatDate       = formatDate;
    res.locals.authUser         = req.session.authUser || null;
    res.locals.isLoggedIn       = req.session.isLoggedIn || false;

    // set current url
    res.locals.currentUrl = req.path;
    next();
});

app.use(methodOverride('_method'));

// routes setup
initRoutes(app);

// 404 Error Handler
app.use((req, res, next) => {
    res.status(404).json({error: 'Not Found'});
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    // Check if the error status is 404
    if (err.status === 404) {
        res.status(404).json({error: 'Not Found'});
    } else {
        console.log(err)
        // For other errors, you can customize the error response
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Running at - http://localhost:${PORT}`);
});
