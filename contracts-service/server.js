// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contractsRoute = require("./routes/contracts");

dotenv.config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB for Contracts Service"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Rutele pentru Contracts Service
app.use("/api/contracts", contractsRoute);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`Contracts Service running on port ${PORT}`)
);
