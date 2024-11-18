const express = require("express");
const router = express.Router();
const axios = require("axios");

const CONTRACTS_SERVICE_URL =
  process.env.CONTRACTS_SERVICE_URL || "http://localhost:3002";
const BOOKS_SERVICE_URL =
  process.env.BOOKS_SERVICE_URL || "http://localhost:3001";

router.get("/", async (req, res) => {
  try {
    const contractsResponse = await axios.get(
      `${CONTRACTS_SERVICE_URL}/api/contracts`
    );
    const contracts = contractsResponse.data;

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
          console.warn(
            `Nu s-au putut obține detaliile pentru cartea cu ID-ul ${contract.bookId}`
          );
          return {
            ...contract,
            bookDetails: null,
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

router.get("/:id", async (req, res) => {
  try {
    const contractResponse = await axios.get(
      `${CONTRACTS_SERVICE_URL}/api/contracts/${req.params.id}`
    );
    const contract = contractResponse.data;

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
      bookDetails = null;
    }

    res.json({
      ...contract,
      bookDetails,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Contractul nu a fost găsit" });
    } else {
      console.error("Eroare la obținerea contractului:", error.message);
      res.status(500).json({ error: "Eroare la obținerea contractului" });
    }
  }
});

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
