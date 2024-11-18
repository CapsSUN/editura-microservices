const express = require("express");
const router = express.Router();
const axios = require("axios");
const Contract = require("../models/Contract");

const AUTHORS_SERVICE_URL =
  process.env.AUTHORS_SERVICE_URL || "http://localhost:3003";
const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

router.get("/", async (req, res) => {
  try {
    const contracts = await Contract.find()
      .populate("author")
      .populate("bookId");
    res.json(contracts);
  } catch (error) {
    console.error("Eroare la obținerea contractelor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea contractelor" });
  }
});

router.post("/", async (req, res) => {
  const { author, bookId, royaltyPercentage } = req.body;

  try {
    const authorResponse = await axios.get(
      `${AUTHORS_SERVICE_URL}/api/authors/${author}`
    );
    if (!authorResponse.data) {
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    }

    const bookResponse = await axios.get(
      `${BOOKS_SERVICE_URL}/api/books/${bookId}`
    );
    if (!bookResponse.data) {
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    }

    const contract = new Contract({ author, bookId, royaltyPercentage });
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    console.error("Eroare la crearea contractului:", error.message);
    res.status(500).json({ error: "Eroare la crearea contractului" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("author")
      .populate("bookId");
    if (!contract)
      return res.status(404).json({ error: "Contractul nu a fost găsit" });
    res.json(contract);
  } catch (error) {
    console.error("Eroare la obținerea contractului:", error.message);
    res.status(500).json({ error: "Eroare la obținerea contractului" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { author, bookId, royaltyPercentage } = req.body;
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      { author, bookId, royaltyPercentage },
      { new: true }
    );
    if (!contract)
      return res.status(404).json({ error: "Contractul nu a fost găsit" });
    res.json(contract);
  } catch (error) {
    console.error("Eroare la actualizarea contractului:", error.message);
    res.status(500).json({ error: "Eroare la actualizarea contractului" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract)
      return res.status(404).json({ error: "Contractul nu a fost găsit" });
    res.json({ message: "Contractul a fost șters cu succes" });
  } catch (error) {
    console.error("Eroare la ștergerea contractului:", error.message);
    res.status(500).json({ error: "Eroare la ștergerea contractului" });
  }
});

module.exports = router;
