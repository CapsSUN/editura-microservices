// api-gateway/routes/authors.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// URL-ul Authors Service din variabilele de mediu sau o valoare implicită
const AUTHORS_SERVICE_URL =
  process.env.AUTHORS_SERVICE_URL || "http://localhost:3003";

// GET /api/authors - Obține toți autorii
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${AUTHORS_SERVICE_URL}/api/authors`);
    res.json(response.data);
  } catch (error) {
    console.error("Eroare la obținerea autorilor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea autorilor" });
  }
});

// POST /api/authors - Creează un autor nou
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTHORS_SERVICE_URL}/api/authors`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Eroare la crearea autorului:", error.message);
    res.status(500).json({ error: "Eroare la crearea autorului" });
  }
});

// GET /api/authors/:id - Obține un autor după ID
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${AUTHORS_SERVICE_URL}/api/authors/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Autorul nu a fost găsit" });
    } else {
      console.error("Eroare la obținerea autorului:", error.message);
      res.status(500).json({ error: "Eroare la obținerea autorului" });
    }
  }
});

// PUT /api/authors/:id - Actualizează un autor după ID
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${AUTHORS_SERVICE_URL}/api/authors/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Autorul nu a fost găsit" });
    } else {
      console.error("Eroare la actualizarea autorului:", error.message);
      res.status(500).json({ error: "Eroare la actualizarea autorului" });
    }
  }
});

// DELETE /api/authors/:id - Șterge un autor după ID
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${AUTHORS_SERVICE_URL}/api/authors/${req.params.id}`
    );
    res.json({ message: "Autorul a fost șters cu succes" });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Autorul nu a fost găsit" });
    } else {
      console.error("Eroare la ștergerea autorului:", error.message);
      res.status(500).json({ error: "Eroare la ștergerea autorului" });
    }
  }
});

module.exports = router;
