const router = require("express").Router();
const stockPosController = require("../controllers/stockpos.controller");
const updateQuantityController = require("../controllers/updatequantity.controller");
const locationsController = require("../controllers/locations.controller");
const reservationController = require("../controllers/reservations.controller");
const availabilityController = require("../controllers/availability.controller");
const productController = require("../controllers/sku.controller");
const inboundasnlines = require("../controllers/inboundasnlines.controller");
const transactions = require("../controllers/transactions.controller");




//router.post("/stockpos", stockPosController.incrementSKUAtLocation);
//router.get("/availability/SKU/:SKU", availabilityController.getTotalSKUQuantityAtLocations);

//input is {SKU:SKU, location:location}
router.get("/availability/onhand", availabilityController.getOnHandQuantityAtLocation);
router.get("/availability/atp", availabilityController.getAvailabilityAtLocation);
router.get("/availability/future", availabilityController.getFutureAvailability);

//get availability combined at all locations, or group of locations, filtered by product attributes
//input is {SKU: {filter : {"Color":"Red", "Size":"Small", "Style"="Round Neck", "_id":"100010"}, Location: {filter: {"City", "State", "Zip", "_id"}}} }
router.get("/availability/combinedatp", availabilityController.getAvailability);


//All Stock Position related end points
router.post("/overridequantity", updateQuantityController.updateQuantityAtLocation);
router.post("/updatequantity", updateQuantityController.incrementQuantityAtLocation);
router.get("/stockpos", stockPosController.getAll);
router.get("/stockpos/:id", stockPosController.getOne);
router.delete("/stockpos/:id", stockPosController.deleteOne);


//All locations related end points
router.post("/locations", locationsController.addOneLocation);
router.post("/locations/load", locationsController.addMultipleLocations);
router.delete("/locations/load", locationsController.deleteMultipleLocations);
router.get("/locations", locationsController.getAllLocations);
router.get("/locations/:id", locationsController.getOneLocation);
router.put("/locations/:id", locationsController.updateOneLocation);
router.delete("/locations/:id", locationsController.deleteOneLocation);

//All Reservation Endpoints
router.post("/reservations", reservationController.createReservation);
router.get("/reservations", reservationController.getAllReservations);
router.get("/reservations/:id", reservationController.getReservation);
router.delete("/reservations/:id", reservationController.deleteOneReservation);
//const newLocal = "/reservations/expired";

router.get("/reservations1", reservationController.getAllExpiredReservation);

//do not use, use delete per reservation

//router.delete("/reservations1", reservationController.deleteAllExpiredReservation);

//All Products Endpoint
router.get("/products", productController.findAllSkus);
router.post("/products", productController.addOneSku);
router.post("/products/load", productController.addMultipleSkus);
router.delete("/products/load", productController.deleteMultipleSkus);


//All ASNLine Endpoints
router.post("/inbound", inboundasnlines.creareInboundASNLine);
router.get("/inbound/:id", inboundasnlines.getOneASNLine);
router.get("/inbound", inboundasnlines.getAllASNLines);
router.delete("/inbound/:id", inboundasnlines.deleteOneASNLine);

//All transaction Endpoints
router.post("/transaction", transactions.addOneTransaction);
router.get("/transaction/:id", transactions.getOneTransaction);
router.get("/transaction", transactions.getAllTransactions);

//Avoid this for transaction consistency, else arrays.map can not guarantee that transaction and stock-pos will be updated in seq

//router.post("/transactions", transactions.addMultipleTransactions); 

module.exports = router;