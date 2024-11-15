const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
