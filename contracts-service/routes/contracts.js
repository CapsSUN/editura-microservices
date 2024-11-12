// contracts-service/routes/contracts.js
const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");

// Obține toate contractele
// router.get("/", async (req, res) => {
//   try {
//     const contracts = await Contract.find().populate("bookId");
//     res.json(contracts);
//   } catch (error) {
//     console.error("Eroare la obținerea contractelor:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea contractelor" });
//   }
// });

// Obține toate contractele fără populate
router.get("/", async (req, res) => {
  try {
    const contracts = await Contract.find(); // fără populate
    res.json(contracts);
  } catch (error) {
    console.error("Eroare la obținerea contractelor:", error.message);
    res.status(500).json({ error: "Eroare la obținerea contractelor" });
  }
});

// Creează un contract nou
router.post("/", async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: "Eroare la crearea contractului" });
  }
});

// Obține un contract după ID
router.get("/:id", async (req, res) => {
  console.log("Cerere primită pentru contract ID:", req.params.id); // Log pentru ID
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      console.log("Contractul nu a fost găsit pentru ID:", req.params.id);
      return res.status(404).json({ error: "Contractul nu a fost găsit" });
    }
    res.json(contract);
  } catch (error) {
    console.error("Eroare la obținerea contractului:", error.message); // Log pentru eroare
    res.status(500).json({ error: "Eroare la obținerea contractului" });
  }
});

// Actualizează un contract după ID
router.put("/:id", async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!contract)
      return res.status(404).json({ error: "Contractul nu a fost găsit" });
    res.json(contract);
  } catch (error) {
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
    res.status(500).json({ error: "Eroare la ștergerea contractului" });
  }
});

module.exports = router;
