const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new AppError("Not authorized, token missing", 401));
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError("Not authorized, token invalid or expired", 401));
    }

}

module.exports = isAuthenticated