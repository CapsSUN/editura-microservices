const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// // GET /api/authors - Obține toți autorii
// router.get("/", async (req, res) => {
//   try {
//     const authors = await Author.find().populate("books");
//     res.json(authors);
//   } catch (error) {
//     console.error("Eroare la obținerea autorilor:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea autorilor" });
//   }
// });

// GET /api/authors - Obține toți autorii fără populate
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find(); // fără .populate("books")
    res.json(authors);
  } catch (error) {
    console.error("Eroare la obținerea autorilor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea autorilor" });
  }
});

// POST /api/authors - Creează un autor nou
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

// // GET /api/authors/:id - Obține un autor după ID
// router.get("/:id", async (req, res) => {
//   try {
//     const author = await Author.findById(req.params.id).populate("books");
//     if (!author)
//       return res.status(404).json({ error: "Autorul nu a fost găsit" });
//     res.json(author);
//   } catch (error) {
//     console.error("Eroare la obținerea autorului:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea autorului" });
//   }
// });

// GET /api/authors/:id - Obține un autor după ID fără populate
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id); // fără .populate("books")
    if (!author)
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    res.json(author);
  } catch (error) {
    console.error("Eroare la obținerea autorului:", error.message);
    res.status(500).json({ error: "Eroare la obținerea autorului" });
  }
});

// // PUT /api/authors/:id - Actualizează un autor după ID
// router.put("/:id", async (req, res) => {
//   try {
//     const { name, bio, birthDate, books } = req.body;
//     const author = await Author.findByIdAndUpdate(
//       req.params.id,
//       { name, bio, birthDate, books },
//       { new: true }
//     );
//     if (!author)
//       return res.status(404).json({ error: "Autorul nu a fost găsit" });
//     res.json(author);
//   } catch (error) {
//     console.error("Eroare la actualizarea autorului:", error.message);
//     res.status(500).json({ error: "Eroare la actualizarea autorului" });
//   }
// });

// // DELETE /api/authors/:id - Șterge un autor după ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const author = await Author.findByIdAndDelete(req.params.id);
//     if (!author)
//       return res.status(404).json({ error: "Autorul nu a fost găsit" });
//     res.json({ message: "Autorul a fost șters cu succes" });
//   } catch (error) {
//     console.error("Eroare la ștergerea autorului:", error.message);
//     res.status(500).json({ error: "Eroare la ștergerea autorului" });
//   }
// });

// PUT /api/authors/:id - Actualizează un autor după ID fără populate
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

// DELETE /api/authors/:id - Șterge un autor după ID fără populate
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

// Ruta pentru actualizarea listei de cărți a autorilor
router.post("/add-book", async (req, res) => {
  try {
    const { authorIds, bookId } = req.body; // Primim lista de autori și ID-ul cărții

    // Actualizăm fiecare autor pentru a adăuga cartea în lista lor de cărți
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
