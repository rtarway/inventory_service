const Reservations = require("../models/reservations");
const validations = require("../utils/validation.js");
const StockPos = require("../models/stock_pos");


exports.createReservation = async (req, res) => {

  console.log(req.body);
  console.log(validateReservationQty_res = await validations.validateReservationQty(req.body.location, req.body.SKU, req.body.Quantity, req.body.reservationDate, req.body.reservationExpiryDate));

  if (validateReservationQty_res != null && validateReservationQty_res.status) {
    const one_reservation = new Reservations(req.body);
    try {
      //save reservation
      await one_reservation.save();
      //save reservation in stp
      let stpid = req.body.location.concat(".", req.body.SKU);
      let stp_reservation = { "_id": req.body._id, "Quantity": req.body.Quantity, "reservationDate": req.body.reservationDate, "reservationExpiryDate": req.body.reservationExpiryDate };
      let stock_pos = await StockPos.findByIdAndUpdate(stpid);
      stock_pos.active_reservations.push(stp_reservation);

      stock_pos.save(function (err) {
        if (err) { thorw(err); }
        else { console.log('success') };
      });

    } catch (err) {
      console.log("exception in try" + err);
      res.status(500).send(err);
    }
    res.status(200).send({ "validateReservationQty_res": validateReservationQty_res, "one_reservation": one_reservation });
  }
  else {
    res.status(404).send(validateReservationQty_res != null ? validateReservationQty_res : "Exception in validation call");
  }
}

exports.getAllReservations = async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    let all_reservations = await Reservations.find(req.body);
    res.json(all_reservations);
  }
  else {
    let all_reservations = await Reservations.find({});
    res.json(all_reservations);
  }


}
exports.getReservation = async (req, res) => {
  let id = req.params.id;
  let reservation = await Reservations.findById(id);

  if (!reservation) {
    return res.status(404).send();
  }

  res.json(reservation);
}




exports.getAllExpiredReservation = async (_req, res) => {

  try {

    let reservation = await Reservations.find({ "reservationExpiryDate": { $lte: new Date() } });
    if (!reservation) {
      res.status(404).send({ "Message": "No Reservations expired yet" });
    }
    else {
      res.status(200).send(reservation);
    }

    //res.json(reservation);
  } catch (err) {

    console.log(err);
    res.status(404).send(err);

  }


}


exports.deleteAllExpiredReservation = async (req, res) => {
  console.log(req.params);
  //let reservationId = req.params.reservationId;
  //console.log (reservationId);
  let reservation = await Reservations.find({ "reservationExpiryDate": { $lte: new Date() } });

  if (!reservation) {
    res.status(404).send({ "Message": "No Reservations expired yet" });
  }
  else {
    //res.status(200).send(reservation);
    reservation.map(_res_line => function (res_line) {
      //TODO : Dont know why this is erroring
      //(await StockPos.findByIdAndUpdate(res_line.location.concat(".",res_line.SKU))).active_reservations.id(res_line._id).remove(); 
      Reservations.findByIdAndDelete(res_line._id);
    });

    //reservation.map(myFunction);
  }
  //TODO : delete from stock pos as well
}

// function myFunction(res_line)
// {
//   //(await StockPos.findByIdAndUpdate(res_line.location.concat(".",res_line.SKU))).active_reservations.id(res_line._id).remove();
//    Reservations.findByIdAndDelete(res_line._id);

// }

exports.deleteOneReservation = async (req, res) => {
  let deleted_reservation = await Reservations.findById(req.params.id);

  console.log(deleted_reservation);

  if(null!=deleted_reservation)
  {
  let parentStockPos = (await StockPos.findById(deleted_reservation.location.concat(".", deleted_reservation.SKU)));
      parentStockPos.active_reservations.id(req.params.id).remove();
  let updateStocPos_result = await parentStockPos.save();
  console.log("test0"+updateStocPos_result);
 
  let result_delete = await Reservations.findByIdAndDelete(req.params.id);
  console.log("test1"+result_delete);
  
  if (updateStocPos_result==null || result_delete==null ) {
    return res.status(404).send();
  }

  let success_result = [{updateStocPos_result},{result_delete}];
  console.log(success_result);
  res.status(200).send(success_result);
}
else
(
   res.status(404).send()
)
}