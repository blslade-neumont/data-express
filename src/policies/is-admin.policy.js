

module.exports.isAdminPolicy = (req, res, next) => {
    if (!req.user) {
        res.status(401).send(`You must be logged in.`);
        return;
    }
    if (!req.user.isAdmin) {
        res.status(403).send(`Unauthorized.`);
        return;
    }
    next();
}
