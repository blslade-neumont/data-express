

module.exports.extractUserPolicy = (req, res, next) => {
    req.user = req.cookies.currentUser || null;
    next();
}
