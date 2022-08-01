const StockPos = require("../models/stock_pos");
const validations = require("../utils/validation.js");

//This method will override existing record
exports.updateQuantityAtLocation = async (req, res) => {
  const stock_pos = new StockPos(req.body);
  console.log(stock_pos);
  const location = stock_pos.location._id;
  const SKU = stock_pos.SKU._id;
  const Quantity = stock_pos.Quantity;
  console.log(location);
  console.log(SKU);
  console.log(Quantity);
  //let result_location = await Locations.find({ "locationId": location });
  console.log(isLocationValid = await validations.validateLocation(location));
  console.log(isSKUValid = await validations.validateSKU(SKU));

  if (isLocationValid && isSKUValid) {
    //await stock_pos.save();
    let stpid = location.toString().concat(".", SKU.toString());
    console.log(stpid);
    let curr_stock_pos = await StockPos.findById(stpid);
    console.log(curr_stock_pos);
    if ((null != curr_stock_pos)) {
      //delete and save
      //await StockPos.findByIdAndDelete(curr_stock_pos[0]._id);
      try {
        await curr_stock_pos.updateOne({ "Quantity": Quantity });
      } catch (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(curr_stock_pos);
    }
    else {
      //just save the request
      try {
        await stock_pos.save();
      } catch (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(stock_pos);
    }
  }
  else {
    return res.status(404).send({ "isLocationValid": isLocationValid, "isSKUValid": isSKUValid, "isQuantityValid": (stock_pos.Quantity > 0) });
    //return res.status(404).send({"isQuantityValid":(stock_pos.Quantity>0)});
  }
}


//this method will increment or decrement existing record or insert a new one if record does not exist and quantity >0, 
//it does not insert new record if qty<=0

exports.incrementQuantityAtLocation = async (req, res) => {
  //const stock_pos = new StockPos(req.body);
  //console.log(stock_pos);
  const _id = req.body._id;
  let location;
  let SKU;

  if (_id == null) {
     location = req.body.location._id;
     SKU = req.body.SKU._id;
    console.log(location);
    console.log(SKU);
  }
  else {
    console.log(_id);
     location = _id.split(".")[0];
     SKU = _id.split(".")[1];
    console.log(location);
    console.log(SKU);
  }


  //let result_location = await Locations.find({"locationId":location});

  console.log(isLocationValid = await validations.validateLocation(location));
  console.log(isSKUValid = await validations.validateSKU(SKU));
  console.log("Passed Quantity" + req.body.Quantity);

  if (isLocationValid && isSKUValid) {

    let stpid = location.concat(".", SKU);
    let curr_stock_pos = await StockPos.findById(stpid);


    if (curr_stock_pos != null) {

      console.log("Current Quantity" + curr_stock_pos.Quantity);
      let newQuantity = curr_stock_pos.Quantity + req.body.Quantity;
      //const stock_pos = new StockPos({"SKU":SKU,"location":location,"Quantity":newQuantity});
      console.log("Updating" + newQuantity);
      let result = {};
      try {
        result = await curr_stock_pos.updateOne({ "Quantity": newQuantity });
      } catch (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);

    }
    else {
      //just save the request
      const stock_pos = new StockPos(req.body);
      try {
        await stock_pos.save();
      } catch (err) {
        return res.status(500).json(err);
      }

      return res.status(200).json(stock_pos);
    }
  }
  else {
    return res.status(404).send({ "isLocationValid": isLocationValid, "isSKUValid": isSKUValid, "isQuantityValid": (req.body.Quantity > 0) });
  }
}