const StockPos = require("../models/stock_pos");
const Locations = require("../models/locations");
const Products = require("../models/sku");
const Trasactions = require("../models/transactions");

const availability_helper = require("../helpers/availability.helper");


exports.validateLocation = async (location) => {

    let result_location = await Locations.findById(location);
    if (result_location == null) {
        console.log("Location is not valid")
        return false;
    }
    else
        return true;

}

exports.validateSKU = async (SKU) => {

    let result_SKU = await Products.findById(SKU);
    if (result_SKU == null) {
        console.log("SKU is not valid")
        return false;
    }
    else
        return true;

}

exports.validateReservationQty = async (location, SKU, QtyToBeReserved, reservationDate, reservationExpiryDate) => {

    //check if location,SKU and Quantity is available 
    let avl_quantity_res = await availability_helper.getOnHandQuantityAtLocation(location, SKU);

    if (avl_quantity_res != null) {

        let status = avl_quantity_res.status;
        let avl_quantity = avl_quantity_res.onhand_quantity;

        // if (status && QtyToBeReserved <= avl_quantity && new Date(reservationDate) > new Date() && QtyToBeReserved > 0 && new Date(reservationDate)<new Date(reservationExpiryDate)) {
        if (status && QtyToBeReserved <= avl_quantity && QtyToBeReserved > 0) {
            let res_obj = {
                "status": true,
                "availability_helper_res": avl_quantity_res
            };

            return res_obj;

        }
        else {
            let res_obj = {
                "status": false,
                "availability_helper_res": avl_quantity_res,
                "isQtyPositive": (QtyToBeReserved > 0),
                "isReservationDateInFuture": (new Date(reservationDate) > new Date()),
                "isReservationExpiryDateInFuture": (new Date(reservationExpiryDate) > new Date(reservationDate)),
                "error_msg": "Either Qty is not available or Input data is not valid: SKU, location should be valid and qty should be >0 " +
                    "and reservation date > current date and reservation exp date>reservation date"
            };
            return res_obj;


        }
    }
    else {
        let res_obj = {
            "status": false,
            "error_msg": "availability_helper.getOnHandQuantityAtLocation returned null"
        };
        return res_obj;


    }


}
exports.validateASN = async (location,
    SKU, Quantity, Expected_Date) => {

    console.log(location);
    console.log(SKU);
    console.log(Quantity);
    console.log(Expected_Date);

    console.log(isLocationValid = await this.validateLocation(location));
    console.log(isSKUValid = await this.validateSKU(SKU));
    console.log(isQuantityValid = (Quantity > 0));
    console.log(isExpected_DateValid = (new Date(Expected_Date) > new Date()));

    if (isLocationValid && isSKUValid && isQuantityValid && isExpected_DateValid) {
        let res_obj = {
            "status": true,
            "isQtyPositive": isQuantityValid,
            "isLocationValid": isLocationValid,
            "isSKUValid": isSKUValid,
            "isExpected_DateValid": isExpected_DateValid
        };
        return res_obj;
    }
    else {
        let res_obj = {
            "status": false,
            "isQtyPositive": isQuantityValid,
            "isLocationValid": isLocationValid,
            "isSKUValid": isSKUValid,
            "isExpected_DateValid": isExpected_DateValid
        };
        return res_obj;

    }


}