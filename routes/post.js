const express = require('express')
const router = express.Router();
const Post = require("../models/Post");
const { verifyToken } = require('./verifyToken');

// POST api/posts/ would add a new post created by the authenticated user.
// - Input: Title, Description
// - RETURN: Post-ID, Title, Description, Created Time(UTC).
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

// DELETE api/posts/{id} would delete post with {id} created by the authenticated user.
router.delete('/posts/:id', verifyToken, async (req, res) => {
    const postId = req.params.id;
    const found = await Post.deleteOne({ _id: postId });
    return res.status(201).json("post deleted");
});

// - POST /api/like/{id} would like the post with {id} by the authenticated user.
router.post('/like/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    // adds to the likes array if it doesnt exists
    const found = await Post.findOneAndUpdate({ _id: postId }, { $addToSet: { likes: userId } }, { new: true });
    return res.status(200).json({ post: found });
});

// - POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.
router.post('/unlike/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    // removes the user from the likes
    const found = await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true });
    return res.status(200).json({ post: found });
});

// - POST /api/comment/{id} add comment for post with {id} by the authenticated user.
//     - Input: Comment
//     - Return: Comment-ID
router.post('/comment/:id', verifyToken, async (req, res) => {
    const {comment} = req.body;
    const userId = req.user.id;
    const postId = req.params.id;
    const newComment = {
        user_id: userId,
        content: comment
      };
    //   push even the duplicates because comments action can be performed any number of times
    const found = await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: newComment } }, { new: true });
    return res.status(200).json({comment_id: found.comments[found.comments.length-1]._id});
});

// GET api/posts/{id} would return a single post with {id} populated with its number of likes and comments
router.get('/posts/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;
    const found = await Post.findOne({ _id: postId, user_id: userId });
    if(!found) return res.status(400).json({ err: "post not found" });
    const {comments, likes, ...post} = found._doc;
    post.likesCount = likes.length;
    post.commentsCount = comments.length;
    return res.status(200).json({post});
});

// GET /api/all_posts would return all posts created by authenticated user sorted by post time.
// - RETURN: For each post return the following values
//     - id: ID of the post
//     - title: Title of the post
//     - desc: Description of the post
//     - created_at: Date and time when the post was created
//     - comments: Array of comments, for the particular post
//     - likes: Number of likes for the particular post
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
    });
    return res.status(200).json({posts});

});



module.exports = router;