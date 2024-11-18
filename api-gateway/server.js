const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/books", require("./routes/books"));
app.use("/api/contracts", require("./routes/contracts"));
app.use("/api/authors", require("./routes/authors"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway rulează pe portul ${PORT}`);
  console.log(`Rute disponibile:`);
  console.log(`/api/books - Rutele pentru Books Service`);
  console.log(`/api/contracts - Rutele pentru Contracts Service`);
  console.log(`/api/authors - Rutele pentru Authors Service`);
});
