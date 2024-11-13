// routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Obține toate cărțile cu detaliile autorilor// GET /api/books - Obține toate cărțile
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Afișează toate cărțile
    res.json(books);
  } catch (error) {
    console.error("Eroare la obținerea cărților:", error.message);
    res.status(500).json({ error: "Eroare la obținerea cărților" });
  }
});

// Creează o nouă carte
router.post("/", async (req, res) => {
  try {
    const { title, authors, genre, isbn, publishedDate } = req.body;
    const book = new Book({ title, authors, genre, isbn, publishedDate });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Eroare la crearea cărții:", error.message);
    res.status(500).json({ error: "Eroare la crearea cărții" });
  }
});

// GET /api/books/:id - Obține o carte după ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    res.json(book);
  } catch (error) {
    console.error("Eroare la obținerea cărții:", error.message);
    res.status(500).json({ error: "Eroare la obținerea cărții" });
  }
});

// PUT /api/books/:id - Actualizează o carte după ID
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book)
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    res.json(book);
  } catch (error) {
    console.error("Eroare la actualizarea cărții:", error.message);
    res.status(500).json({ error: "Eroare la actualizarea cărții" });
  }
});

// DELETE /api/books/:id - Șterge o carte după ID
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book)
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    res.json({ message: "Cartea a fost ștearsă cu succes" });
  } catch (error) {
    console.error("Eroare la ștergerea cărții:", error.message);
    res.status(500).json({ error: "Eroare la ștergerea cărții" });
  }
});

module.exports = router;
