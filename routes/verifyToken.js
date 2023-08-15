const jwt = require('jsonwebtoken');

// verify the token 
const verifyToken = (req, res, next) => {
    // take the token from the headers
    const token = req.headers.token;
    if (token) {
        // verify it and add the user to the req
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
