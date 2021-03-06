

module.exports.isAdminPolicy = (req, res, next) => {
    if (!req.user) {
        res.status(401).render('error', {req: req, utils: utils, title: 'Error', msg: `You must be logged in.`});
        return;
    }
    if (!req.user.isAdmin) {
        res.status(403).render('error', {req: req, utils: utils, title: 'Error', msg: `Unauthorized.`});
        return;
    }
    next();
}
