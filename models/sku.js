const mongoose = require("mongoose");

//use SKU as id, hence SKU is unique

const skuSchema = new mongoose.Schema(

    {
        _id: String,
        Color: String,
        Size: String,
        Style: String,
        Product: String,
        Category: String
    }
);

const SKU = mongoose.model("sku", skuSchema);

module.exports = SKU, skuSchema;
