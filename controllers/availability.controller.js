
const availability_helper = require("../helpers/availability.helper");

//{SKU:SKU,location:location}
exports.getOnHandQuantityAtLocation = async (req, res) => {

  //const stock_pos = new StockPos(req.body);
  console.log(req.body);
  const location = req.body.location;
  const SKU = req.body.SKU;

  try {
    let helper_res_obj = await availability_helper.getOnHandQuantityAtLocation(location, SKU);


    console.log("helper_res_obj" + JSON.stringify(helper_res_obj));

    if (helper_res_obj != null && helper_res_obj.status) { res.status(200).send(helper_res_obj); }

    else { res.status(404).send(((helper_res_obj == null) ? "No record found" : helper_res_obj)); }
  }
  catch (err) {
    res.status(500).send(err);
  }
}

//{SKU:SKU,location:location}
exports.getAvailabilityAtLocation = async (req, res) => {

  console.log(req.body);
  const location = req.body.location;
  const SKU = req.body.SKU;

  try {

    let helper_res_obj = await availability_helper.getAvailabilityAtLocation(location, SKU);

    console.log(JSON.stringify(helper_res_obj));

    if (helper_res_obj != null && helper_res_obj.status) { res.status(200).send(helper_res_obj); }
    else { res.status(404).send(((helper_res_obj == null) ? "No record found" : helper_res_obj)); }
  } catch (err) {
    res.status(500).send(err);
  }
}

exports.getAvailability = async (req, res) => {

  console.log(req.body);


  try {

    let total_avl_qty = await availability_helper.getAvailabilityFilters(req.body);

    console.log("total_avl_qty" + total_avl_qty.available_quantity);

    if (total_avl_qty != null) { res.send(total_avl_qty); }
    else { res.status(404).send(((total_avl_qty == null) ? "No record found" : total_avl_qty)); }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.getFutureAvailability = async (req, res) => {

  console.log(req.body);


  try {

    let total_ftr_avl_qty = await availability_helper.getFutureAvailabilityFilters(req.body.location, req.body.SKU, req.body.days);

    console.log("total_ftr_avl_qty" + total_ftr_avl_qty[0] + "\n" + total_ftr_avl_qty[1]);

    if (total_ftr_avl_qty != null) { res.send(total_ftr_avl_qty); }
    else { res.status(404).send(((total_ftr_avl_qty == null) ? "No record found" : total_ftr_avl_qty)); }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

// exports.getTotalSKUQuantityAtLocations = async (req, res) => {
//   const SKU = req.params.SKU;

//   let result = await StockPos.aggregate([
//     {
//       '$lookup': {
//         'from': 'locations',
//         'localField': 'location._id',
//         'foreignField': 'locationId',
//         'as': 'results'
//       }
//     }, {
//       '$match': {
//         'SKU': SKU
//       }
//     }, {
//       '$group': {
//         '_id': '$SKU',
//         'Total_Quantity': {
//           '$sum': '$Quantity'
//         }
//       }
//     }
//   ]);
//   res.json(result[0].Total_Quantity);
// }


///////
  //query for a group of locations
  // [
  //   {
  //     '$lookup': {
  //       'from': 'locations',
  //       'localField': 'location',
  //       'foreignField': 'locationId',
  //       'as': 'results'
  //     }
  //   }, {
  //     '$match': {
  //       'SKU': '100010',
  //       '$or': [
  //         {
  //           'location': 'store001'
  //         }, {
  //           'location': 'store002'
  //         }
  //       ]
  //     }
  //   }, {
  //     '$group': {
  //       '_id': '$SKU',
  //       'Total_Quantity': {
  //         '$sum': '$Quantity'
  //       }
  //     }
  //   }
  // ]

  ///query based on product attibutes and location

  // [
  //   {
  //     '$lookup': {
  //       'from': 'products',
  //       'localField': 'SKU',
  //       'foreignField': 'SKU',
  //       'as': 'products'
  //     }
  //   }, {
  //     '$lookup': {
  //       'from': 'locations',
  //       'localField': 'location',
  //       'foreignField': 'locationId',
  //       'as': 'location'
  //     }
  //   }, {
  //     '$match': {
  //       'SKU': '100010',
  //       'location.locationId': 'store001',
  //       'products.Color': 'Red'
  //     }
  //   }, {
  //     '$group': {
  //       '_id': '$SKU',
  //       'Total Qty': {
  //         '$sum': '$Quantity'
  //       }
  //     }
  //   }
  // ]


//Query for products with specific attributes at multiple locations

  // [
  //   {
  //     '$lookup': {
  //       'from': 'products',
  //       'localField': 'SKU',
  //       'foreignField': 'SKU',
  //       'as': 'products'
  //     }
  //   }, {
  //     '$lookup': {
  //       'from': 'locations',
  //       'localField': 'location',
  //       'foreignField': 'locationId',
  //       'as': 'location'
  //     }
  //   }, {
  //     '$match': {
  //       'SKU': '100010',
  //       '$or': [
  //         {
  //           'location.locationId': 'store001'
  //         }, {
  //           'location.locationId': 'store002'
  //         }
  //       ],
  //       'products.Color': 'Red'
  //     }
  //   }, {
  //     '$group': {
  //       '_id': '$SKU',
  //       'Total Qty': {
  //         '$sum': '$Quantity'
  //       }
  //     }
  //   }
  // ]

