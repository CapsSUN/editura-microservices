// module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const eventBus = require("../eventBus"); // Importă eventBus

// Inițializează cache-ul cu un TTL de 10 minute
const cache = new NodeCache({ stdTTL: 600 });

// URL-ul Books Service din variabilele de mediu
const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

// Middleware pentru a verifica cache-ul
const checkCache = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    console.log(`Servind datele din cache pentru: ${key}`);
    return res.json(cachedResponse); // Returnează răspunsul din cache
  }
  next(); // Continuă cererea dacă nu există în cache
};

// GET /api/books - Obține toate cărțile, cu caching
router.get("/", checkCache, async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_SERVICE_URL}/api/books`);
    cache.set(req.originalUrl, response.data); // Stochează răspunsul în cache
    res.json(response.data);
  } catch (error) {
    console.error("Eroare la obținerea cărților:", error.message);
    res.status(500).json({ error: "Eroare la obținerea cărților" });
  }
});

// Emiterea evenimentului BOOK_CREATED și actualizarea autorilor
const emitBookCreatedEvent = async (book) => {
  console.log("Eveniment BOOK_CREATED emis pentru cartea:", book);

  try {
    // Trimite cererea către authors-service pentru a actualiza autorii cu noua carte
    await axios.post("http://localhost:3003/api/authors/add-book", {
      authorIds: book.authors,
      bookId: book._id,
    });
    console.log("Autorii au fost actualizați cu noua carte.");
  } catch (error) {
    console.error("Eroare la actualizarea autorilor:", error.message);
  }
};

// Funția pentru crearea unei cărți noi
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${BOOKS_SERVICE_URL}/api/books`,
      req.body
    );
    const newBook = response.data;
    res.status(201).json(newBook);

    // Invalidează cache-ul pentru toate cărțile
    cache.del("/api/books");

    // Emite un eveniment "BOOK_CREATED" și trimite datele cărții
    await emitBookCreatedEvent(newBook);
  } catch (error) {
    console.error("Eroare la crearea cărții:", error.message);
    res.status(500).json({ error: "Eroare la crearea cărții" });
  }
});

// GET /api/books/:id - Obține o carte după ID (fără caching pentru ID-uri individuale)
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

// PUT /api/books/:id - Actualizează o carte după ID (fără caching)
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`,
      req.body
    );

    // Invalidează cache-ul pentru toate cărțile
    cache.del("/api/books");

    // Emite un eveniment "BOOK_UPDATED" și trimite datele actualizate ale cărții
    eventBus.emit("BOOK_UPDATED", response.data);
    console.log("Eveniment BOOK_UPDATED emis pentru cartea:", response.data);

    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Cartea nu a fost găsită" });
    } else {
      res.status(500).json({ error: "Eroare la actualizarea cărții" });
    }
  }
});

// DELETE /api/books/:id - Șterge o carte după ID (fără caching)
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`
    );

    // Invalidează cache-ul pentru toate cărțile
    cache.del("/api/books");

    // Emite un eveniment "BOOK_DELETED" și trimite ID-ul cărții șterse
    eventBus.emit("BOOK_DELETED", req.params.id);
    console.log("Eveniment BOOK_DELETED emis pentru cartea ID:", req.params.id);

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
