const mongoose = require("mongoose");
const User = require("./user");

const bookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    status: {
        type: String,
        enum: ["Want to Read", "Reading", "Completed"],
        required: true,
        default: "Want to Read"
    }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book