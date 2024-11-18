const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const axios = require("axios");

const AUTHORS_API_URL =
  process.env.AUTHORS_API_URL || "http://localhost:5000/api/authors";

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
    console.error("Eroare la căutarea cărților:", error.message);
    res.status(500).json({ error: "Eroare la căutarea cărților" });
  }
});

router.get("/", async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalBooks = await Book.countDocuments();

    res.json({
      data: books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: Number(page),
      totalBooks,
    });
  } catch (error) {
    console.error("Eroare la obținerea cărților:", error.message);
    res.status(500).json({ error: "Eroare la obținerea cărților" });
  }
});

router.post("/", async (req, res) => {
  const { title, authors, genre, isbn, publishedDate } = req.body;

  try {
    for (const authorId of authors) {
      const authorResponse = await axios.get(`${AUTHORS_API_URL}/${authorId}`);
      if (!authorResponse.data) {
        return res
          .status(400)
          .json({ error: `Autorul cu ID ${authorId} nu există.` });
      }
    }

    const book = new Book({ title, authors, genre, isbn, publishedDate });
    await book.save();
    res.status(201).json({ message: "Cartea a fost adăugată cu succes", book });
  } catch (error) {
    console.error("Eroare la adăugarea cărții:", error.message);
    res.status(500).json({ error: "Eroare la adăugarea cărții" });
  }
});

router.get("/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    if (!bookId) {
      return res.status(400).json({ error: "ID-ul cărții este necesar." });
    }

    const book = await Book.findById(bookId).populate("reviews");
    if (!book) {
      return res.status(404).json({ error: "Cartea nu a fost găsită." });
    }

    const authorDetails = await Promise.all(
      book.authors.map(async (authorId) => {
        try {
          const response = await axios.get(`${AUTHORS_API_URL}/${authorId}`);
          return response.data;
        } catch (error) {
          console.error(
            `Eroare la obținerea detaliilor autorului ${authorId}:`,
            error.message
          );
          return { error: `Detalii indisponibile pentru autorul ${authorId}` };
        }
      })
    );

    res.json({
      ...book.toObject(),
      authors: authorDetails,
    });
  } catch (error) {
    console.error("Eroare la obținerea detaliilor cărții:", error.message);
    res.status(500).json({ error: "Eroare la obținerea detaliilor cărții." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: "Cartea nu a fost găsită." });
    }
    res.json(book);
  } catch (error) {
    console.error("Eroare la actualizarea cărții:", error.message);
    res.status(500).json({ error: "Eroare la actualizarea cărții." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Cartea nu a fost găsită." });
    }
    res.json({ message: "Cartea a fost ștearsă cu succes." });
  } catch (error) {
    console.error("Eroare la ștergerea cărții:", error.message);
    res.status(500).json({ error: "Eroare la ștergerea cărții." });
  }
});

module.exports = router;
