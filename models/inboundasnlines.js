const mongoose = require("mongoose");

//The Id will be format "$ReceivingLoc.$SKU.<sourcedocumenttype>.<sourcedocumentnumber>.<sequentiallineid>"
const asnLineSchema = new mongoose.Schema(
    {
        _id: String,
        source_document: { type: String, enum: ["PO", "TO"] },
        source_document_number: String,
        asn_line_number: String,
        stock_pos_id: String,
        receiving_location: String,
        SKU: String,
        Quantity: Number,
        Expected_date: Date
    });

const INBOUND_ASN_LINE = mongoose.model("inbound_asn_line", asnLineSchema);

module.exports = INBOUND_ASN_LINE;