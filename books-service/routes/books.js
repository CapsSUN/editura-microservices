// routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET: Căutare avansată
router.get("/search", async (req, res) => {
  const { title, genre, author, startDate, endDate } = req.query;
  const filters = {};

  if (title) filters.title = { $regex: title, $options: "i" };
  if (genre) filters.genre = genre;
  if (author) filters.authors = author;
  if (startDate || endDate) {
    filters.publishedDate = {};
    if (startDate) filters.publishedDate.$gte = new Date(startDate);
    if (endDate) filters.publishedDate.$lte = new Date(endDate);
  }

  try {
    const books = await Book.find(filters).populate("authors");
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Eroare la căutarea cărților" });
  }
});

// GET: Obține toate cărțile cu paginare
router.get("/", async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Setează valori implicite pentru pagină și limită
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber <= 0 ||
    limitNumber <= 0
  ) {
    return res.status(400).json({
      error: "Parametrii paginii și limitei trebuie să fie numere pozitive.",
    });
  }

  try {
    // Calculează datele pentru paginare
    const books = await Book.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalBooks = await Book.countDocuments(); // Numărul total de cărți

    // Returnează datele paginării
    res.json({
      data: books,
      totalPages: Math.ceil(totalBooks / limitNumber),
      currentPage: pageNumber,
      totalBooks,
    });
  } catch (error) {
    console.error("Eroare la obținerea cărților cu paginare:", error.message);
    res.status(500).json({ error: "Eroare la obținerea cărților" });
  }
});

// Obține toate cărțile cu detaliile autorilor// GET /api/books - Obține toate cărțile
// router.get("/", async (req, res) => {
//   try {
//     const books = await Book.find(); // Afișează toate cărțile
//     res.json(books);
//   } catch (error) {
//     console.error("Eroare la obținerea cărților:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea cărților" });
//   }
// });

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
