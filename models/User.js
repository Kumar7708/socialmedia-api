const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model("user", UserSchema);
module.exports = User;