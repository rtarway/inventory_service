const StockPos = require("../models/stock_pos");
const Locations = require("../models/locations");
const Products = require("../models/sku");
const Trasactions = require("../models/transactions");
const ASNLine = require("../models/inboundasnlines");
const validations = require("../utils/validation.js");
//const { process_params } = require("express/lib/router");


exports.getOnHandQuantityAtLocation = async (location, SKU) => {

    console.log(location);
    console.log(SKU);

    console.log(isLocationValid = await validations.validateLocation(location));
    console.log(isSKUValid = await validations.validateSKU(SKU));

    if (isLocationValid && isSKUValid) {
        let stpid = location.concat(".", SKU);
        console.log(stpid);
        let curr_stock_pos = await StockPos.findById(stpid);
        console.log(curr_stock_pos);
        if (curr_stock_pos != null) {
            let res_obj = {
                "status": true,
                "onhand_quantity": (curr_stock_pos.Quantity)
            };
            return res_obj;
        }
        else {
            let res_obj = {
                "status": false,
                "onhand_quantity": null,
                "error_msg": "No record exists in stock_pos"
            };
            return res_obj;
        }
    }
    else {
        let res_obj = {
            "status": false,
            "onhand_quantity": null,
            "isLocationValid": isLocationValid,
            "isSKUValid": isSKUValid,
            "error_msg": "Either SKU or Location or both are not valid"
        };
        return res_obj;
    }
}

//get availability at a location ( Onhand-reservations)
exports.getAvailabilityAtLocation = async (location, SKU) => {

    console.log(location);
    console.log(SKU);

    console.log(isLocationValid = await validations.validateLocation(location));
    console.log(isSKUValid = await validations.validateSKU(SKU));

    if (isLocationValid && isSKUValid) {
        let stpid = location.concat(".", SKU);
        console.log(stpid);
        let curr_stock_pos = await StockPos.findById(stpid);
        console.log(curr_stock_pos);
        // if (curr_stock_pos!=null) {
        //     let reserved_qty=get_reserved_quantity(curr_stock_pos).Quantity;
        //     console.log(reserved_qty);
        //     let res_obj = {
        //         "status": true,
        //         "onhand_quantity": (curr_stock_pos.Quantity),
        //         "reserved_quantity": reserved_qty,
        //         "available_quantity": (curr_stock_pos.Quantity)-reserved_qty
        //     };
        //     return res_obj;
        // }
        // else  {
        //     let res_obj = {
        //         "status": false,
        //         "onhand_quantity": null,
        //         "reserved_quantity": null,
        //         "available_quantity": null,
        //         "error_msg": "No record exists in stock_pos"
        //     };
        //     return res_obj;
        // }

        return process(curr_stock_pos);

    }
    else {
        let res_obj = {
            "status": false,
            "onhand_quantity": null,
            "reserved_quantity": null,
            "available_quantity": null,
            "isLocationValid": isLocationValid,
            "isSKUValid": isSKUValid,
            "error_msg": "Either SKU or Location or both are not valid"
        };
        return res_obj;
    }
}

//private function
function get_reserved_quantity(curr_stock_pos) {
    if (null != curr_stock_pos) {
        let valid_reservations = curr_stock_pos.active_reservations.filter(reservations => reservations.reservationExpiryDate > new Date());
        let total_reserved_qty = valid_reservations.reduce(function (previous, current) {
            console.log(previous);
            console.log(current);
            return { "Quantity": previous.Quantity + current.Quantity };
        }, { "Quantity": 0 });
        console.log(total_reserved_qty);
        return total_reserved_qty;
    }
    else return { "Quantity": 0 };
}

exports.getFutureAvailabilityFilters = async (location, SKU, days) => {

    let current_availability = await this.getAvailabilityAtLocation(location, SKU);
    console.log(current_availability);

    let today_plus_days = new Date(new Date().setDate(new Date().getDate() + days));

    let obj = {
        "Receiving_location": location,
        "SKU": SKU,
        "stock_pos_id": location.concat(".", SKU),
        "Expected_date": { $gt: new Date(), $lte: today_plus_days }
    };

    console.log(JSON.stringify(obj));


    let all_asn_lines = await ASNLine.find(obj).sort({ "Expected_date": 1 });

    if (all_asn_lines != null) {
        let qty_available_date = all_asn_lines.map(line => ({ "Expected_date": line.Expected_date, "Quantity": line.Quantity }))


        return [current_availability, qty_available_date];
    }
    else
        return [current_availability, { "message": "No Future Availability" }];

}

exports.getAvailabilityFilters = async (reqbody_obj) => {

    // let query = "[
    //     {
    //       '$match': {
    //         '$or': [
    //           {
    //             'location._id': 'store004'
    //           }, {
    //             'location._id': 'store002'
    //           }
    //         ], 
    //         '$and': [
    //           {
    //             '$or': [
    //               {
    //                 'SKU.Color': 'Red'
    //               }, {
    //                 'SKU.Color': 'Blue'
    //               }
    //             ]
    //           }, {
    //             'SKU.Size': 'Medium'
    //           }
    //         ]
    //       }
    //     }
    //   ]";

    let query = reqbody_obj;
    let results = await StockPos.aggregate(query); //is an array of stock pos objects

    console.log("got results from aggregate" + results);

    if (null != results) {
        final_result = results.map(result => process(result));
        let total_available_qty =
            final_result.reduce(function (previous, current) {
                console.log(previous);
                console.log(current);
                return { "available_quantity": previous.available_quantity + current.available_quantity };
            }, { "available_quantity": 0 });

        console.log("total_available_qty" + JSON.stringify(total_available_qty));
        return total_available_qty;
    }
    else {
        return ({ "available_quantity": 0 });
    }
}

function process(curr_stock_pos) {
    console.log(curr_stock_pos);
    if (curr_stock_pos != null) {
        let reserved_qty = get_reserved_quantity(curr_stock_pos).Quantity;
        console.log(reserved_qty);
        let res_obj = {
            "status": true,
            "onhand_quantity": (curr_stock_pos.Quantity),
            "reserved_quantity": reserved_qty,
            "available_quantity": (curr_stock_pos.Quantity) - reserved_qty
        };
        return res_obj;
    }
    else {
        let res_obj = {
            "status": false,
            "onhand_quantity": null,
            "reserved_quantity": null,
            "available_quantity": null,
            "error_msg": "No record exists in stock_pos"
        };
        return res_obj;
    }
}