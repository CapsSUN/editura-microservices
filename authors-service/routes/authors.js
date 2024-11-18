const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    console.error("Eroare la obținerea autorilor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea autorilor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, bio, birthDate, books } = req.body;
    const author = new Author({ name, bio, birthDate, books });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    console.error("Eroare la crearea autorului:", error.message);
    res.status(500).json({ error: "Eroare la crearea autorului" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author)
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    res.json(author);
  } catch (error) {
    console.error("Eroare la obținerea autorului:", error.message);
    res.status(500).json({ error: "Eroare la obținerea autorului" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, bio, birthDate, books } = req.body;
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { name, bio, birthDate, books },
      { new: true }
    );
    if (!author)
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    res.json(author);
  } catch (error) {
    console.error("Eroare la actualizarea autorului:", error.message);
    res.status(500).json({ error: "Eroare la actualizarea autorului" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author)
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    res.json({ message: "Autorul a fost șters cu succes" });
  } catch (error) {
    console.error("Eroare la ștergerea autorului:", error.message);
    res.status(500).json({ error: "Eroare la ștergerea autorului" });
  }
});

router.post("/add-book", async (req, res) => {
  try {
    const { authorIds, bookId } = req.body;

    await Author.updateMany(
      { _id: { $in: authorIds } },
      { $push: { books: bookId } }
    );

    res.status(200).json({ message: "Cartea a fost adăugată autorilor." });
  } catch (error) {
    console.error("Eroare la adăugarea cărții autorilor:", error.message);
    res.status(500).json({ error: "Eroare la actualizarea autorilor" });
  }
});

module.exports = router;
