const mongoose = require("mongoose");
const { Schema } = mongoose;

const FollowSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    follower_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
const Post = mongoose.model("follow", FollowSchema);
module.exports = Post;