const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
  genre: { type: String, required: true },
  isbn: { type: String, unique: true, required: true },
  publishedDate: { type: Date, default: Date.now },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("Book", BookSchema);
