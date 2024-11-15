const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  birthDate: { type: Date },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // Referință la cărțile autorului
});

module.exports = mongoose.model("Author", AuthorSchema);
