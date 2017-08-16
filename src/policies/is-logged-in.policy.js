

module.exports.isLoggedInPolicy = (req, res, next) => {
    if (!req.user) {
        res.status(401).send(`You must be logged in.`);
        return;
    }
    next();
}
