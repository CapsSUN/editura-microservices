// // server.js
// const express = require("express");
// const dotenv = require("dotenv");
// const NodeCache = require("node-cache");
// const axios = require("axios");

// // Încarcă variabilele de mediu
// dotenv.config();

// const app = express();
// app.use(express.json());

// // Inițializează cache-ul cu un TTL (timp de expirare) de 10 minute pentru fiecare intrare
// const cache = new NodeCache({ stdTTL: 600 }); // 600 secunde = 10 minute

// // Funcție middleware pentru a verifica cache-ul înainte de a accesa microserviciile
// const checkCache = (req, res, next) => {
//   const key = req.originalUrl;
//   const cachedResponse = cache.get(key);
//   if (cachedResponse) {
//     console.log(`Servind datele din cache pentru: ${key}`);
//     return res.json(cachedResponse); // Returnează din cache
//   }
//   next(); // Continuă cererea dacă nu există în cache
// };

// // URL-urile microserviciilor
// const BOOKS_SERVICE_URL =
//   process.env.BOOKS_SERVICE_URL || "http://localhost:3001";
// const CONTRACTS_SERVICE_URL =
//   process.env.CONTRACTS_SERVICE_URL || "http://localhost:3002";
// const AUTHORS_SERVICE_URL =
//   process.env.AUTHORS_SERVICE_URL || "http://localhost:3003";

// // Ruta pentru Books Service, cu cache și apel direct la microserviciu
// app.get("/api/books", checkCache, async (req, res) => {
//   try {
//     const response = await axios.get(`${BOOKS_SERVICE_URL}/api/books`);
//     cache.set(req.originalUrl, response.data); // Stochează răspunsul în cache
//     res.json(response.data); // Trimite răspunsul către client
//   } catch (error) {
//     console.error("Eroare la obținerea cărților:", error.message);
//     res.status(500).json({ error: "Eroare la obținerea cărților" });
//   }
// });

// // Include rutele pentru celelalte microservicii (Contracts și Authors)
// app.use("/api/contracts", require("./routes/contracts"));
// app.use("/api/authors", require("./routes/authors"));

// // Export cache și middleware-ul checkCache pentru utilizare în alte module de rute, dacă este necesar
// module.exports = { cache, checkCache };

// // Pornire API Gateway
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`API Gateway rulează pe portul ${PORT}`));

// // app.use("/api/contracts", require("./routes/contracts"));
// // app.use("/api/authors", require("./routes/authors"));
// // app.use("/api/orders", require("./routes/orders"));
// // app.use("/api/sales", require("./routes/sales"));
// // app.use("/api/inventory", require("./routes/inventory"));
// // app.use("/api/events", require("./routes/events"));

// server.js
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// Include rutele pentru microserviciile Books, Contracts și Authors
app.use("/api/books", require("./routes/books"));
app.use("/api/contracts", require("./routes/contracts"));
app.use("/api/authors", require("./routes/authors"));

// Pornire API Gateway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway rulează pe portul ${PORT}`);
  console.log(`Rute disponibile:`);
  console.log(`/api/books - Rutele pentru Books Service`);
  console.log(`/api/contracts - Rutele pentru Contracts Service`);
  console.log(`/api/authors - Rutele pentru Authors Service`);
});
