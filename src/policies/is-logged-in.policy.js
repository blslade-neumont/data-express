

module.exports.isLoggedInPolicy = (req, res, next) => {
    if (!req.user) {
        res.status(401).render('error', {req: req, utils: utils, title: 'Error', msg: `You must be logged in.`});
        return;
    }
    next();
}
