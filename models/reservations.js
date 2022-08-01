const mongoose = require("mongoose");
const LOCATIONS = require("./locations");
const SKU = require("./sku");

const { Schema } = mongoose;


const reservationSchema = Schema(
   {
      _id: String,
      SKU: String,
      Quantity: Number,
      location: String, //locationId where transaction occurs
      reservationDate: { type: Date, min: Date.now() + 1 * 24 * 60 * 60 * 1000, max: Date.now() + 30 * 24 * 60 * 60 * 1000 }, //date reservation is created
      reservationExpiryDate: {
         type: Date, default: function () {

            return Date.now() + 8 * 24 * 60 * 60 * 1000;
         }, min: this.reservationDate + 1 * 24 * 60 * 60 * 1000, max: this.reservationDate + 8 * 24 * 60 * 60 * 1000
      } //date reservation will be set expired
   }
);

const RESERVATIONS = mongoose.model("reservations", reservationSchema);


module.exports = RESERVATIONS;
