const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const eventBus = require("../eventBus");

const cache = new NodeCache({ stdTTL: 600 });

const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

const checkCache = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    console.log(`Serving cached data for: ${key}`);
    return res.json(cachedResponse);
  }
  next();
};

router.get("/", checkCache, async (req, res) => {
  try {
    const response = await axios.get(`${BOOKS_SERVICE_URL}/api/books`);
    cache.set(req.originalUrl, response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting books:", error.message);
    res.status(500).json({ error: "Error getting books" });
  }
});

const emitBookCreatedEvent = async (book) => {
  console.log("Eveniment BOOK_CREATED emis pentru cartea:", book);

  try {
    await axios.post("http://localhost:3003/api/authors/add-book", {
      authorIds: book.authors,
      bookId: book._id,
    });
    console.log("Autorii au fost actualizați cu noua carte.");
  } catch (error) {
    console.error("Eroare la actualizarea autorilor:", error.message);
  }
};

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${BOOKS_SERVICE_URL}/api/books`,
      req.body
    );
    const newBook = response.data;
    res.status(201).json(newBook);

    cache.del("/api/books");

    await emitBookCreatedEvent(newBook);
  } catch (error) {
    console.error("Eroare la crearea cărții:", error.message);
    res.status(500).json({ error: "Eroare la crearea cărții" });
  }
});

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

router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`,
      req.body
    );

    cache.del("/api/books");

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

router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${BOOKS_SERVICE_URL}/api/books/${req.params.id}`
    );

    cache.del("/api/books");

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
