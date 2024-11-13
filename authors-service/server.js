// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const authorsRoute = require("./routes/authors");

// dotenv.config();
// const app = express();
// app.use(express.json());

// // Conectare la MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Conectat la MongoDB pentru Authors Service"))
//   .catch((error) => console.log("Eroare la conectarea la MongoDB:", error));

// // Rutele pentru Authors Service
// app.use("/api/authors", authorsRoute);

// const PORT = process.env.PORT || 3003;
// app.listen(PORT, () =>
//   console.log(`Authors Service rulează pe portul ${PORT}`)
// );

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authorsRoute = require("./routes/authors");

dotenv.config();
const app = express();
app.use(express.json());

// Conectare la MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectat la MongoDB pentru Authors Service"))
  .catch((error) => console.log("Eroare la conectarea la MongoDB:", error));

// Rutele pentru Authors Service
app.use("/api/authors", authorsRoute);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Authors Service rulează pe portul ${PORT}`)
);
