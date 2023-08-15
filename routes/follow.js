const express = require('express')
const router = express.Router();
const Follow = require("../models/Follow")
const { verifyToken } = require('./verifyToken');

router.post('/follow/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const followerId = req.params.id;
    const found = await Follow.findOne({ user_id: userId, follower_id: followerId });
    if (found) return res.status(200).json("user already follows");
    const newFollower = new Follow({ user_id: userId, follower_id: followerId });
    await newFollower.save();
    return res.status(201).json("User started following");
});

router.post('/unfollow/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const followerId = req.params.id;
    const found = await Follow.deleteOne({ user_id: userId, follower_id: followerId });
    return res.status(201).json("User unfollowed");
});

module.exports = router;