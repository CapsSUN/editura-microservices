// // contracts-service/routes/contracts.js
// const express = require("express");
// const router = express.Router();
// const Contract = require("../models/Contract");

// // Obține toate contractele fără populate
// router.get("/", async (req, res) => {
//   try {
//     const contracts = await Contract.find(); // fără populate
//     res.json(contracts);
//   } catch (error) {
//     console.error("Eroare la obținerea contractelor:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea contractelor" });
//   }
// });

// // Creează un contract nou
// router.post("/", async (req, res) => {
//   try {
//     const contract = new Contract(req.body);
//     await contract.save();
//     res.status(201).json(contract);
//   } catch (error) {
//     res.status(500).json({ error: "Eroare la crearea contractului" });
//   }
// });

// // Obține un contract după ID
// router.get("/:id", async (req, res) => {
//   console.log("Cerere primită pentru contract ID:", req.params.id); // Log pentru ID
//   try {
//     const contract = await Contract.findById(req.params.id);
//     if (!contract) {
//       console.log("Contractul nu a fost găsit pentru ID:", req.params.id);
//       return res.status(404).json({ error: "Contractul nu a fost găsit" });
//     }
//     res.json(contract);
//   } catch (error) {
//     console.error("Eroare la obținerea contractului:", error.message); // Log pentru eroare
//     res.status(500).json({ error: "Eroare la obținerea contractului" });
//   }
// });

// // Actualizează un contract după ID
// router.put("/:id", async (req, res) => {
//   try {
//     const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!contract)
//       return res.status(404).json({ error: "Contractul nu a fost găsit" });
//     res.json(contract);
//   } catch (error) {
//     res.status(500).json({ error: "Eroare la actualizarea contractului" });
//   }
// });

// // Șterge un contract după ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const contract = await Contract.findByIdAndDelete(req.params.id);
//     if (!contract)
//       return res.status(404).json({ error: "Contractul nu a fost găsit" });
//     res.json({ message: "Contractul a fost șters cu succes" });
//   } catch (error) {
//     res.status(500).json({ error: "Eroare la ștergerea contractului" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const Contract = require("../models/Contract");

// URL-urile pentru `authors-service` și `books-service`
const AUTHORS_SERVICE_URL =
  process.env.AUTHORS_SERVICE_URL || "http://localhost:3003";
const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

// Obține toate contractele
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

// Creează un contract nou
router.post("/", async (req, res) => {
  const { author, bookId, royaltyPercentage } = req.body;

  try {
    // Verificăm dacă autorul există
    const authorResponse = await axios.get(
      `${AUTHORS_SERVICE_URL}/api/authors/${author}`
    );
    if (!authorResponse.data) {
      return res.status(404).json({ error: "Autorul nu a fost găsit" });
    }

    // Verificăm dacă cartea există
    const bookResponse = await axios.get(
      `${BOOKS_SERVICE_URL}/api/books/${bookId}`
    );
    if (!bookResponse.data) {
      return res.status(404).json({ error: "Cartea nu a fost găsită" });
    }

    // Creăm contractul după verificare
    const contract = new Contract({ author, bookId, royaltyPercentage });
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    console.error("Eroare la crearea contractului:", error.message);
    res.status(500).json({ error: "Eroare la crearea contractului" });
  }
});

// Obține un contract după ID
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

// Actualizează un contract după ID
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

// Șterge un contract după ID
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
