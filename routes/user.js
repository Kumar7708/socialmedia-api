const express = require('express')
const router = express.Router();
const User = require("../models/User");
const Follow = require("../models/Follow");
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./verifyToken');

router.post('/authenticate', async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({err: "provide all credentials"});
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SEC_PASS);
    const newUser = new User({
        email,
        password: encryptedPassword
    });
    const savedUser = await newUser.save();        
    const token = jwt.sign(
        {
            id: savedUser._id,
        },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
    );
    return res.status(200).json({user: savedUser, token}); 
});

router.get('/user', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const followingCount = await Follow.count({user_id: userId});
    const followersCount = await Follow.count({follow_id: userId});
    const {email} = await User.findOne({_id : userId})
    return res.status(200).json({email, followersCount, followingCount});
    
})

module.exports = router;