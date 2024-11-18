// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const booksRoute = require("./routes/books");

// dotenv.config();

// const app = express();
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Conectat la MongoDB pentru Books Service"))
//   .catch((error) => console.log("Eroare la conectarea cu MongoDB:", error));

// // Rutele pentru Books Service
// app.use("/api/books", booksRoute);

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Books Service rulează pe portul ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const booksRoute = require("./routes/books");

const reviewsRoute = require("./routes/reviews");
// console.log("Reviews Route:", reviewsRoute);

dotenv.config();
const app = express();
app.use(express.json());

// Conectare MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectat la MongoDB"))
  .catch((error) => console.error("Eroare la conectarea cu MongoDB:", error));

// Adăugare rute
app.use("/api/books", booksRoute);
app.use("/api/reviews", reviewsRoute);

// Pornire server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Books Service rulează pe portul ${PORT}`));
