const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
    ],
    comments: [
        {
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            content: {
                type: String,
                required: true
            },
            created_at: {
                type: Date,
                default: Date.now
            }
        }
    ],

    created_at: {
        type: Date,
        default: Date.now
    }
});
const Post = mongoose.model("post", PostSchema);
module.exports = Post;