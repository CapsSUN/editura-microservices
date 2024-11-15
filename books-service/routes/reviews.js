const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Book = require("../models/Book");

// POST: Adaugă o recenzie și actualizează automat cartea
router.post("/", async (req, res) => {
  const { book, user, rating, comment } = req.body;

  try {
    // Verifică dacă cartea există
    const bookExists = await Book.findById(book);
    if (!bookExists) {
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    }

    // Creează recenzia
    const review = new Review({ book, user, rating, comment });
    await review.save();

    // Adaugă recenzia la carte și returnează cartea actualizată
    const updatedBook = await Book.findByIdAndUpdate(
      book,
      { $push: { reviews: review._id } },
      { new: true }
    ).populate("reviews");

    res.status(201).json({
      message: "Recenzia a fost adăugată cu succes",
      review,
      updatedBook,
    });
  } catch (error) {
    console.error("Eroare la crearea recenziei:", error.message);
    res.status(500).json({ error: "Eroare la crearea recenziei" });
  }
});

// GET: Obține recenziile pentru o carte
router.get("/:bookId", async (req, res) => {
  try {
    // Verifică dacă cartea există
    const bookExists = await Book.findById(req.params.bookId);
    if (!bookExists) {
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    }

    // Obține recenziile pentru carte
    const reviews = await Review.find({ book: req.params.bookId });
    res.json(reviews);
  } catch (error) {
    console.error("Eroare la obținerea recenziilor cărții:", error.message);
    res.status(500).json({ error: "Eroare la obținerea recenziilor cărții" });
  }
});

// GET: Obține toate recenziile
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("book");
    res.json(reviews);
  } catch (error) {
    console.error("Eroare la obținerea recenziilor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea recenziilor" });
  }
});

module.exports = router;
