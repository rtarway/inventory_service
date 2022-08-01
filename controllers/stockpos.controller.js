const StockPos = require("../models/stock_pos");

exports.getAll = async (req, res) => {
  console.log("request" + req);
  let all_stock_pos = await StockPos.find({});
  res.json(all_stock_pos);
}
exports.getOne = async (req, res) => {
  let id = req.params.id;
  let stock_pos = await StockPos.findById(id);

  if (!stock_pos) {
    return res.status(404).send();
  }

  res.json(stock_pos);
}

exports.updateOne = async (req, res) => {
  let stock_pos = await StockPos.findByIdAndUpdate(req.params.id, req.body, { new: false });

  if (!stock_pos) {
    return res.status(404).send();
  }

  res.json(stock_pos);
}

exports.deleteOne = async (req, res) => {
  let deleted_stock_pos = await StockPos.findByIdAndDelete(req.params.id);

  if (!deleted_stock_pos) {
    return res.status(404).send();
  }

  res.json(deleted_stock_pos);
}