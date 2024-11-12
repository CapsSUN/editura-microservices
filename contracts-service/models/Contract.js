// models/Contract.js
const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
  author: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  royaltyPercentage: { type: Number, required: true },
  signedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contract", ContractSchema);
