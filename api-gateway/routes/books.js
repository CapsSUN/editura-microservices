const express = require("express");
const router = express.Router();
const axios = require("axios");
const cache = require("../server").cache; // Importă cache-ul din server.js
const checkCache = require("../server").checkCache; // Importă middleware-ul checkCache
const CircuitBreaker = require("opossum");

// URL-ul Books Service din variabilele de mediu
const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

// Configurare pentru circuit breaker
const options = {
  timeout: 3000, // Timpul maxim de răspuns pentru fiecare cerere (3 secunde)
  errorThresholdPercentage: 50, // Circuitul se deschide dacă 50% din cereri eșuează
  resetTimeout: 10000, // Circuitul se va reseta după 10 secunde
};

// Funcția care face cererea către Books Service
const getBooks = async () => {
  return axios.get(`${BOOKS_SERVICE_URL}/api/books`);
};

// Configurăm circuit breaker-ul cu funcția getBooks
const breaker = new CircuitBreaker(getBooks, options);

// Gestionare evenimente circuit breaker
breaker.on("open", () =>
  console.log("Circuitul este DESCHIS - oprirea temporară a cererilor")
);
breaker.on("halfOpen", () =>
  console.log("Circuitul este pe cale să se redeschidă")
);
breaker.on("close", () =>
  console.log("Circuitul este ÎNCHIS - cererile au fost reluate")
);

// GET /api/books - Obține toate cărțile cu cache și circuit breaker
router.get("/", checkCache, async (req, res) => {
  try {
    const response = await breaker.fire(); // Folosește circuit breaker-ul
    cache.set(req.originalUrl, response.data); // Stochează răspunsul în cache
    res.json(response.data); // Trimite răspunsul către client
  } catch (error) {
    console.error(
      "Eroare la obținerea cărților prin circuit breaker:",
      error.message
    );
    res.status(500).json({
      error: "Serviciul de cărți nu este disponibil în acest moment.",
    });
  }
});

// 2. POST /api/books - Creează o nouă carte
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${BOOKS_SERVICE_URL}/api/books`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Eroare la crearea cărții" });
  }
});

// 3. GET /api/books/:id - Obține o carte după ID
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Cartea nu a fost găsită" });
    } else {
      res.status(500).json({ error: "Eroare la obținerea cărții" });
    }
  }
});

// 4. PUT /api/books/:id - Actualizează o carte după ID
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Cartea nu a fost găsită" });
    } else {
      res.status(500).json({ error: "Eroare la actualizarea cărții" });
    }
  }
});

// 5. DELETE /api/books/:id - Șterge o carte după ID
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`
    );
    res.json({ message: "Cartea a fost ștearsă cu succes" });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Cartea nu a fost găsită" });
    } else {
      res.status(500).json({ error: "Eroare la ștergerea cărții" });
    }
  }
});

module.exports = router;
