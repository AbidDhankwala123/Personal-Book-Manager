const { mongoose } = require("mongoose");
const Book = require("../models/book");
const AppError = require("../utils/AppError");

const getBooks = async (req, res, next) => {
    try {
        const { tags, status } = req.query;

        const filter = {
            userId: req.user.id
        };

        if (status) {
            filter.status = Array.isArray(status) ? { $in: status } : status;
        }

        if (tags) {
            filter.tags = Array.isArray(tags) ? { $in: tags } : { $in: [tags] };
        }

        const books = await Book.find(filter);

        res.status(200).json({
            status: "SUCCESS",
            count: books.length,
            books
        });

    } catch (error) {
        next(error);
    }
};

const addBook = async (req, res, next) => {
    try {
        const { title, author, tags, status } = req.body;

        const userId = req.user.id;

        if (!title || !author) {
            return next(new AppError("Title and Author fields are required", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new AppError("Invalid Id format", 400));
        }

        if (tags && !Array.isArray(tags)) {
            return next(new AppError("Tags must be an array", 400));
        }

        if (status !== undefined && !["Want to Read", "Reading", "Completed"].includes(status)) {
            return next(new AppError("Invalid status value", 400))
        }

        const book = await Book.create({ userId, title, author, tags, status });
        res.status(201).json({
            status: "SUCCESS",
            message: "Book added successfully",
            book
        })
    } catch (error) {
        next(error)
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return next(new AppError("Invalid Id format", 400));
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return next(new AppError("Book not found", 404));
        }

        await Book.findByIdAndDelete(bookId);

        res.status(200).json({
            status: "SUCCESS",
            message: "Book deleted successfully",
        })
    } catch (error) {
        next(error);
    }
}

const updateBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;

        const { title, author, tags, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return next(new AppError("Invalid Id format", 400));
        }

        const book = await Book.findByIdAndUpdate(bookId, { title, author, tags, status }, { new: true, runValidators: true });
        if (!book) {
            return next(new AppError("Book not found", 404));
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "Book Updated Successfully",
            book
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getBooks, addBook, deleteBook, updateBook }