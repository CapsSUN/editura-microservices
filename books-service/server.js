const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const booksRoute = require("./routes/books");

const reviewsRoute = require("./routes/reviews");

dotenv.config();
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectat la MongoDB"))
  .catch((error) => console.error("Eroare la conectarea cu MongoDB:", error));

app.use("/api/books", booksRoute);
app.use("/api/reviews", reviewsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Books Service rulează pe portul ${PORT}`));
