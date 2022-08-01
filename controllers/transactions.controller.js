const Transactions = require("../models/transactions");
const StockPos = require("../models/stock_pos");

exports.addOneTransaction = async (req, res) => {
  const one_Transaction = new Transactions(req.body);
  await one_Transaction.save();
  //TODO adjust StockPOs Onhand Qty
  const stpid = req.body.location.concat(".", req.body.SKU);
  const transaction_type = req.body.transaction_type;
  const quantity = req.body.Quantity;
  processTransaction(transaction_type, stpid, quantity);

  res.json(one_Transaction);

}

async function processTransaction(transaction_type, stpid, quantity) {

  let stock_pos = await StockPos.findById(stpid);
  console.log(stock_pos);
  let curr_qty = stock_pos.Quantity;
  console.log(curr_qty);
  console.log(transaction_type);

  switch (transaction_type) {
    //"RECEIPT","SALE","TRANSFER_OUT","RETURN"
    case "RECEIPT":
      //Increase StockPos
      await stock_pos.updateOne({ "Quantity": curr_qty + quantity });
      break;
    case "SALE":
      //Decrease StockPos
      await stock_pos.updateOne({ "Quantity": curr_qty - quantity });
      break;
    case "TRANSFER_OUT":
      //Decrease StockPos
      await stock_pos.updateOne({ "Quantity": curr_qty - quantity });
      break;
    case "RETURN":
      //Decrease StockPos
      await stock_pos.updateOne({ "Quantity": curr_qty + quantity });
      break;
  }
}

exports.addMultipleTransactions = async (req, res) => {
  console.log(req.body);
  const multiple_transactions = req.body;
  let result = await Transactions.insertMany(multiple_transactions);
  //TODO adjust StockPOs Onhand Qty
  await multiple_transactions.map(transaction => processTransaction(transaction.transaction_type, transaction.location.concat(".", transaction.SKU), transaction.Quantity));
  res.json(result);
}


exports.getAllTransactions = async (req, res) => {
  console.log("request" + req);
  let all_transactions = await Transactions.find({});
  res.json(all_transactions);
}

exports.getOneTransaction = async (req, res) => {
  let id = req.params.id;
  let transaction = await Transactions.findById(id);

  if (!transaction) {
    return res.status(404).send({ "Message": "No Transactions Found" });
  }

  res.json(transaction);
}

//Transactions are immutable, so can not update or delete
//To correct a transaction, enter a reverse of original transaction

// exports.updateOneTransaction = async (req, res) => {
//   let transaction = await Transactions.findByIdAndUpdate(req.params.id, req.body, { new: true });

//   if (!transaction) {
//     return res.status(404).send({"Message":"No Transactions Found"});
//   }

//   res.json(transaction);
// }

// exports.deleteOneTransaction= async (req, res) => {
//   let deleted_location = await Transactions.findByIdAndDelete(req.params.id);

//   if (!deleted_location) {
//     return res.status(404).send();
//   }

//   res.json(deleted_location);
// }

// exports.deleteMultipleLocations = async (req, res) => {
//   console.log(req);
//   const multiple_locations = req.body;
//   let result = await Locations.deleteMany(multiple_locations);
//   res.json(result);
// }