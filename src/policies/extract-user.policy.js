let { User } = require('../models/user');
let { utils } = require('../utils');

module.exports.extractUserPolicy = (req, res, next) => {
    let user = req.cookies.currentUser || null;
    try {
        if (user) user = JSON.parse(user);
    }
    catch (e) {
        console.error(e);
        console.error(`user: ${user}`);
        res.cookie('currentUser', user = null);
    }
    
    if (!user) {
        req.user = null;
        next();
        return;
    }
    
    User.findOne({ _id: user._id }, (err, actUser) => {
        if (err) {
            res.status(500).render('error', {req: req, utils: utils, title: 'Error', msg: 'An unknown error occurred in the extractUsePolicy'});
            console.error(err);
            return;
        }
        req.user = user = actUser;
        res.cookie('currentUser', JSON.stringify(user));
        next();
        return;
    });
}
