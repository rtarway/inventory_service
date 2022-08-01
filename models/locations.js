const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(

    {
        _id: mongoose.Schema.Types.ObjectId,
        Address_Line1: String,
        Address_Line2: String,
        City: String,
        State: String,
        Zip: String
    }
);

//use location id as _id of the schema
const locationSchema = new mongoose.Schema({
    _id: String,
    Address: addressSchema
});

// {
//   "_id": "store001",
//   "Address": {
//     "Address_Line1_StreetNo": "312",
//     "Address_Line1_StreetName": "NW Main St",
//     "City": "New York",
//     "State": "NY",
//     "Zip": "10001"
//   }
// }


const LOCATIONS = mongoose.model("locations", locationSchema);

module.exports = LOCATIONS;
