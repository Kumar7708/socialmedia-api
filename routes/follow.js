const express = require('express')
const router = express.Router();
const Follow = require("../models/Follow")
const { verifyToken } = require('./verifyToken');


// - POST /api/follow/{id} authenticated user would follow user with {id}
router.post('/follow/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const followerId = req.params.id;
    // find user with userId and followerId if not exists create
    const found = await Follow.findOne({ user_id: userId, follower_id: followerId });
    if (found) return res.status(200).json("user already follows");
    const newFollower = new Follow({ user_id: userId, follower_id: followerId });
    await newFollower.save();
    return res.status(201).json("User started following");
});


// - POST /api/unfollow/{id} authenticated user would unfollow a user with {id}
router.post('/unfollow/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const followerId = req.params.id;
    // delete the document where user with userId and followerId
    const found = await Follow.deleteOne({ user_id: userId, follower_id: followerId });
    return res.status(201).json("User unfollowed");
});

module.exports = router;