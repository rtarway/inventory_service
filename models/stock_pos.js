const mongoose = require("mongoose");

// const stockPosSchema = new mongoose.Schema(
//   {
//     _id:String,

//     SKU: {
//        type:String,
//        ref:SKU,        
//        Color: String,
//        Size: String,
//        Style: String,
//        Product: String
//       },

//     location: {
//        type:String,
//        ref:LOCATIONS, 
//        State:String, 
//        City:String, 
//        Zip:String  
//       },
//     Quantity: {type: Number, required:true, min:[0,"can't create a record with negative qty"]},

//     active_reservations:[
//         {ref: RESERVATIONS, 
//          type:String, 
//          Quantity:Number, 
//          reservationDate:Date, 
//          reservationExpiryDate:Date
//         }
//       ],

//     inbound_asn_30days: [
//       {ref:INBOUND_ASN, 
//       type:String, 
//       Quantity:Number, 
//       Expecetd_Date:Date
//       }
//     ]
// });

const stockPosSchema = new mongoose.Schema(
  {
    _id: String,

    SKU: {
      _id: String,
      Color: String,
      Size: String,
      Style: String,
      Product: String
    },

    location: {
      _id: String,
      State: String,
      City: String,
      Zip: String
    },
    Quantity: { type: Number, required: true, min: [0, "can't create a record with negative qty"] },

    active_reservations: [
      {
        _id: String,
        Quantity: Number,
        reservationDate: Date,
        reservationExpiryDate: Date
      }
    ]
  });


// //{
//   "SKU": "100010",
//   "location": "store001",
//   "Quantity": 30
// }

const STOCK_POS = mongoose.model("stock_pos", stockPosSchema);

module.exports = STOCK_POS;
