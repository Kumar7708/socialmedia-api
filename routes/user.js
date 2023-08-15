const express = require('express')
const router = express.Router();
const User = require("../models/User");
const Follow = require("../models/Follow");
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./verifyToken');

// - POST /api/authenticate should perform user authentication and return a JWT token.
//     - INPUT: Email, Password
//     - RETURN: JWT token
router.post('/authenticate', async(req, res) => {
    const {email, password} = req.body;
    // if email or password is not present ask for credentials
    if(!email || !password) return res.status(400).json({err: "provide all credentials"});
    // encrypting the password using AES
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SEC_PASS);
    // creating a new user and saving the new user in database
    const newUser = new User({
        email,
        password: encryptedPassword
    });

    const savedUser = await newUser.save();     
    // signing the jwt token that has id of the user and returning token   
    const token = jwt.sign(
        {
            id: savedUser._id,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
    );
    return res.status(200).json({token}); 
});


// - GET /api/user should authenticate the request and return the respective user profile.
//     - RETURN: email, number of followers & followings.
router.get('/user', verifyToken, async (req, res) => {
    const userId = req.user.id;
    // countig for number of following for the user
    const followingCount = await Follow.count({user_id: userId});
    // countig for number of followers for the user
    const followersCount = await Follow.count({follow_id: userId});
    const {email} = await User.findOne({_id : userId})
    return res.status(200).json({email, followersCount, followingCount});
    
})

module.exports = router;