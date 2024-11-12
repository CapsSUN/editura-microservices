// models/Author.js
const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  birthDate: { type: Date },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // referință la cărțile scrise de autor
});

module.exports = mongoose.model("Author", AuthorSchema);
