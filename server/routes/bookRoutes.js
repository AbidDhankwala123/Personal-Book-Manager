const express = require("express");
const router = express.Router();
const { getBooks, addBook, deleteBook, updateBook } = require("../controllers/bookController");
const isAuthenticated = require("../middleware/authenticationMiddleware");

router.get("/books", isAuthenticated, getBooks);
router.post("/addBook", isAuthenticated, addBook);
router.delete("/deleteBook/:bookId", isAuthenticated, deleteBook);
router.put("/updateBook/:bookId", isAuthenticated, updateBook);

module.exports = router;