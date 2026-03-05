const express = require("express");
const router = express.Router();
const { getBooks, addBook, deleteBook, updateBook, getBookById } = require("../controllers/bookController");
const isAuthenticated = require("../middleware/authenticationMiddleware");

router.get("/books", isAuthenticated, getBooks);
router.get("/book/:bookId", isAuthenticated, getBookById);
router.post("/addBook", isAuthenticated, addBook);
router.delete("/deleteBook/:bookId", isAuthenticated, deleteBook);
router.patch("/updateBook/:bookId", isAuthenticated, updateBook);

module.exports = router;