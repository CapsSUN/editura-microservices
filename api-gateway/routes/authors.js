const express = require("express");
const router = express.Router();
const axios = require("axios");

const AUTHORS_SERVICE_URL =
  process.env.AUTHORS_SERVICE_URL || "http://localhost:3003";

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${AUTHORS_SERVICE_URL}/api/authors`);
    res.json(response.data);
  } catch (error) {
    console.error("Error retrieving authors:", error.message);
    res.status(500).json({ error: "Error retrieving authors" });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTHORS_SERVICE_URL}/api/authors`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error creating author:", error.message);
    res.status(500).json({ error: "Error creating author" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${AUTHORS_SERVICE_URL}/api/authors/${req.params.id}`
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Author not found" });
    } else {
      console.error("Error retrieving the author:", error.message);
      res.status(500).json({ error: "Error retrieving the author" });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${AUTHORS_SERVICE_URL}/api/authors/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Author not found" });
    } else {
      console.error("Error updating the author:", error.message);
      res.status(500).json({ error: "Error updating the author" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${AUTHORS_SERVICE_URL}/api/authors/${req.params.id}`
    );
    res.json({ message: "Author successfully deleted" });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: "Author not found" });
    } else {
      console.error("Error deleting the author:", error.message);
      res.status(500).json({ error: "Error deleting the author" });
    }
  }
});

module.exports = router;
