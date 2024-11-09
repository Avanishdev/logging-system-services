const roleMiddleware = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    req.query.userId = req.user.id;
    next();
};

module.exports = roleMiddleware;
