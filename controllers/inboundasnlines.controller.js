
const validations = require("../utils/validation.js");
const ASNLine =  require("../models/inboundasnlines");

exports.creareInboundASNLine = async (req, res) => {

  console.log(req.body);
  console.log(validateASN_res = await validations.validateASN(req.body.receiving_location, 
    req.body.SKU, req.body.Quantity, req.body.Expected_date));

  if (validateASN_res != null && validateASN_res.status) {
    const one_asn_line = new ASNLine(req.body);
    try {
      //save asn line
      await one_asn_line.save();

    } catch (err) {
      console.log("exception in try" + err);
      res.status(500).send(err);
    }
    res.status(200).send({ "validateASN_res": validateASN_res, "one_asn_line": one_asn_line });
  }
  else {
    res.status(404).send(validateASN_res != null ? validateASN_res : "Exception in validation call");
  }
}



exports.getAllASNLines = async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    let all_asn_lines = await ASNLine.find(req.body);
    res.json(all_asn_lines);
  }
  else {
    let all_asn_lines = await ASNLine.find({});
    res.json(all_asn_lines);
  }


}
exports.getOneASNLine = async (req, res) => {
  let id = req.params.id;
  let asn_line = await ASNLine.findById(id);

  if (null==asn_line) {
    res.status(404).send({"error": "Could Not find the line by id"});
  }
  else{
  res.status(200).send(asn_line);
  }
}

exports.deleteOneASNLine = async (req, res) => {
  let deleted_asnline = await ASNLine.findByIdAndDelete(req.params.id);

  if (deleted_asnline==null) {
   res.status(404).send({"error": "Could Not find the line by id"});
  }
  else{

  res.status(200).sedn(deleted_asnline);
  }

  //TODO delete from stock pos as well
}