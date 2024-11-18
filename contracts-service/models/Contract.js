const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  royaltyPercentage: { type: Number, required: true },
  signedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contract", ContractSchema);
