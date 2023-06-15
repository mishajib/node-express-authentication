const home = (req, res) => {
    return res.render('index', {title: 'Home Page'});
};

const dashboard = (req, res) => {
    return res.render('dashboard', {title: 'Dashboard'});
};

module.exports = {
    home,
    dashboard
};