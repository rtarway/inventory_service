const mongoose = require("mongoose");

//Transaction_id will be in form "locationId.SkuId.<Tranasaction_Seq_Num starting with TransactionType initial>"
const transactionSchema = new mongoose.Schema(
  {
    _id: String,
    transaction_type: { type: String, enum: ["RECEIPT", "SALE", "TRANSFER_OUT", "RETURN"] },
    SKU: String,
    Quantity: Number,
    location: String,
    transaction_date: Date
  }
);

const TRANSACTIONS = mongoose.model("transactions", transactionSchema);
module.exports = TRANSACTIONS;
