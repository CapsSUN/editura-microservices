// // models/Book.js
// const mongoose = require("mongoose");

// const BookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   authors: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
//   ], // listă de autori
//   genre: { type: String, required: true },
//   isbn: { type: String, unique: true, required: true },
//   publishedDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Book", BookSchema);

// const mongoose = require("mongoose");

// const BookSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   authors: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
//   ],
//   genre: { type: String, required: true },
//   isbn: { type: String, unique: true, required: true },
//   publishedDate: { type: Date, default: Date.now },
//   bestseller: { type: Boolean, default: false },
//   recommended: { type: Boolean, default: false },
//   reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
// });

// module.exports = mongoose.model("Book", BookSchema);

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
