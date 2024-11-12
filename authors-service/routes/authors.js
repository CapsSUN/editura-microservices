// routes/authors.js
const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// Obține toți autorii
// router.get("/", async (req, res) => {
//   try {
//     const authors = await Author.find().populate("books"); // Populează cărțile autorului
//     res.json(authors);
//   } catch (error) {
//     res.status(500).json({ error: "Eroare la obținerea autorilor" });
//   }
// });

router.get("/", async (req, res) => {
  try {
    console.log("Cerere pentru obținerea tuturor autorilor...");
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    console.error("Eroare la obținerea autorilor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea autorilor" });
  }
});

// Creează un autor nou
router.post("/", async (req, res) => {
  try {
    const author = new Author(req.body);
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ error: "Eroare la crearea autorului" });
  }
});

// Obține un autor după ID
// router.get("/:id", async (req, res) => {
//   try {
//     const author = await Author.findById(req.params.id).populate("books");
//     if (!author)
//       return res.status(404).json({ error: "Autorul nu a fost găsit" });
//     res.json(author);
//   } catch (error) {
//     res.status(500).json({ error: "Eroare la obținerea autorului" });
//   }
// });

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

// Actualizează un autor după ID
router.put("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!author)
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: "Eroare la actualizarea autorului" });
  }
});

// Șterge un autor după ID
router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author)
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    res.json({ message: "Autorul a fost șters cu succes" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la ștergerea autorului" });
  }
});

module.exports = router;
