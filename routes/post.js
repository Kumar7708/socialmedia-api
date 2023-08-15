const express = require('express')
const router = express.Router();
const Post = require("../models/Post");
const { verifyToken } = require('./verifyToken');

router.post('/posts', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ err: "provide all values" });

    const newPost = new Post({
        user_id: userId,
        title,
        description
    });
    const savedPost = await newPost.save();
    return res.status(200).json({ post_id: savedPost._id, title, description, created_at: savedPost.created_at });
});

router.delete('/posts/:id', verifyToken, async (req, res) => {
    const postId = req.params.id;
    const found = await Post.deleteOne({ _id: postId });
    return res.status(201).json("post deleted");
});

router.post('/like/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    const found = await Post.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: userId } }, { new: true });
    return res.status(200).json({ post: found });
});

router.post('/unlike/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    const found = await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true });
    return res.status(200).json({ post: found });
});

router.post('/comment/:id', verifyToken, async (req, res) => {
    const {comment} = req.body;
    const userId = req.user.id;
    const postId = req.params.id;
    const newComment = {
        user_id: userId,
        content: comment
      };
    const found = await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment } }, { new: true });
    console.log(found.comments[found.comments.length-1]._id);
    return res.status(200).json({comment_id: found.comments[found.comments.length-1]._id});
});

router.post('/posts/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    const found = await Post.findOne({ _id: postId, user_id: userId });
    if(!found) return res.status(400).json({ err: "post not found" });
    const {comments, likes, ...post} = found._doc;
    post.likesCount = likes.length;
    post.commentCount = comments.length;
    return res.status(200).json({post});
});

router.post('/all_posts', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const found = await Post.find({ user_id: userId });
    const posts = found.map((post) => {
        const obj = {};
        obj.id = post._id;
        obj.title = post.title;
        obj.desc = post.description;
        obj.created_at = post.created_at;
        obj.comments = post.comments;
        obj.likesCount = post.likes.length;
        return obj;
    })
    return res.status(200).json({posts});

});



module.exports = router;