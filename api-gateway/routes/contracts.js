// api-gateway/routes/contracts.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// URL-ul Contracts Service din variabilele de mediu sau un fallback
const CONTRACTS_SERVICE_URL =
  process.env.CONTRACTS_SERVICE_URL || "http://localhost:3002";
const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

// GET /api/contracts - Obține toate contractele
router.get("/", async (req, res) => {
  try {
    // Obține toate contractele
    const contractsResponse = await axios.get(
      `${CONTRACTS_SERVICE_URL}/api/contracts`
    );
    const contracts = contractsResponse.data;

    // Obține detaliile cărților pentru fiecare contract
    const contractDetails = await Promise.all(
      contracts.map(async (contract) => {
        try {
          const bookDetails = await axios.get(
            `${BOOKS_SERVICE_URL}/api/books/${contract.bookId}`
          );
          return {
            ...contract,
            bookDetails: bookDetails.data,
          };
        } catch (error) {
          // Dacă Books Service nu este disponibil sau cartea nu este găsită, returnează doar contractul
          console.warn(
            `Nu s-au putut obține detaliile pentru cartea cu ID-ul ${contract.bookId}`
          );
          return {
            ...contract,
            bookDetails: null, // Sau poți exclude complet acest câmp dacă preferi
          };
        }
      })
    );

    res.json(contractDetails);
  } catch (error) {
    console.error("Eroare la obținerea contractelor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea contractelor" });
  }
});

// POST /api/contracts - Creează un contract nou
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${CONTRACTS_SERVICE_URL}/api/contracts`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Eroare la crearea contractului" });
  }
});

// GET /api/contracts/:id - Obține un contract după ID
router.get("/:id", async (req, res) => {
  try {
    // Obține contractul specific după ID din Contracts Service
    const contractResponse = await axios.get(
      `${CONTRACTS_SERVICE_URL}/api/contracts/${req.params.id}`
    );
    const contract = contractResponse.data;

    // Încearcă să obții detaliile cărții asociate din Books Service
    let bookDetails = null;
    try {
      const bookResponse = await axios.get(
        `${BOOKS_SERVICE_URL}/api/books/${contract.bookId}`
      );
      bookDetails = bookResponse.data;
    } catch (error) {
      console.warn(
        `Books Service nu este disponibil sau cartea nu a fost găsită pentru bookId: ${contract.bookId}`
      );
      bookDetails = null; // Setează la null dacă Books Service este deconectat sau cartea nu există
    }

    // Returnează răspunsul combinat: contractul și detaliile cărții
    res.json({
      ...contract,
      bookDetails,
    });
  } catch (error) {
    // Gestionarea erorilor în cazul în care contractul nu a fost găsit sau alte probleme
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Contractul nu a fost găsit" });
    } else {
      console.error("Eroare la obținerea contractului:", error.message);
      res.status(500).json({ error: "Eroare la obținerea contractului" });
    }
  }
});

// PUT /api/contracts/:id - Actualizează un contract după ID
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${CONTRACTS_SERVICE_URL}/api/contracts/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Contractul nu a fost găsit" });
    } else {
      res.status(500).json({ error: "Eroare la actualizarea contractului" });
    }
  }
});

// DELETE /api/contracts/:id - Șterge un contract după ID
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${CONTRACTS_SERVICE_URL}/api/contracts/${req.params.id}`
    );
    res.json({ message: "Contractul a fost șters cu succes" });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Contractul nu a fost găsit" });
    } else {
      res.status(500).json({ error: "Eroare la ștergerea contractului" });
    }
  }
});

module.exports = router;
