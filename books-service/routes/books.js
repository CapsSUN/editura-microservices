// routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Obține toate cărțile
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Creează o nouă carte
router.post("/", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

// Obține o carte după ID
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Actualizează o carte după ID
router.put("/:id", async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Șterge o carte după ID
router.delete("/:id", async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book deleted successfully" });
});

module.exports = router;
