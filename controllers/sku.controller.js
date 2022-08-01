const SKU = require("../models/sku");

exports.findAllSkus = async (req, res) => {

  console.log(req);
  let all_products = await SKU.find({});
  res.json(all_products);

}
exports.addOneSku = async (req, res) => {
  const one_product = new SKU(req.body);
  await one_product.save();
  res.json(one_product);
}

exports.addMultipleSkus = async (req, res) => {
  console.log(req);
  const multiple_products = req.body;
  let result = await SKU.insertMany(multiple_products);
  res.json(result);
}

exports.deleteMultipleSkus = async (_req, res) => {
  res.status(404).send("Not implemented yet");
}