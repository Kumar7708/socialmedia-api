const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json({err: err.message})
            }
            req.user = user;
            next();
        })
    }
    else {
        return res.status(401).json("you are not authenticated!");
    }
}

module.exports = { verifyToken };
