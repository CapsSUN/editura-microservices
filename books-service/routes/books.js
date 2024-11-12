// routes/books.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Funție pentru trimiterea unui mesaj de eroare
const handleError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ error: message });
};

// Obține toate cărțile
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    handleError(res, "Eroare la obținerea cărților");
  }
});

// Creează o carte nouă
router.post("/", async (req, res) => {
  try {
    // Caută o carte cu același ISBN
    const existingBook = await Book.findOne({ isbn: req.body.isbn });
    if (existingBook) {
      return handleError(res, "Cartea cu acest ISBN există deja", 400);
    }

    // Dacă nu există, creează cartea nouă
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    handleError(res, "Eroare la crearea cărții");
  }
});

// Obține o carte după ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return handleError(res, "Cartea nu a fost găsită", 404);
    }
    res.json(book);
  } catch (error) {
    handleError(res, "Eroare la obținerea cărții");
  }
});

// Actualizează o carte după ID
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return handleError(res, "Cartea nu a fost găsită", 404);
    }
    res.json(book);
  } catch (error) {
    handleError(res, "Eroare la actualizarea cărții");
  }
});

// Șterge o carte după ID
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return handleError(res, "Cartea nu a fost găsită", 404);
    }
    res.json({ message: "Cartea a fost ștearsă cu succes" });
  } catch (error) {
    handleError(res, "Eroare la ștergerea cărții");
  }
});

module.exports = router;
