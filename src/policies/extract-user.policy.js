

module.exports.extractUserPolicy = (req, res, next) => {
    req.user = req.cookies.currentUser || null;
    try {
        if (req.user) req.user = JSON.parse(req.user);
    }
    catch (e) {
        console.error(e);
        res.cookie('currentUser', req.user = null);
    }
    next();
}
