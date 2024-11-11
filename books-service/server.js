// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const booksRoute = require("./routes/books");

dotenv.config();
const app = express();
app.use(express.json());

// Conectare la MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Rutele pentru Books Service
app.use("/api/books", booksRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Books service running on port ${PORT}`));
