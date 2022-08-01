const Locations = require("../models/locations");

exports.addOneLocation = async (req, res) => {
  const one_locations = new Locations(req.body);
  await one_locations.save();
  res.json(one_locations);
}

exports.addMultipleLocations = async (req, res) => {
  console.log(req);
  const multiple_locations = req.body;
  let result = await Locations.insertMany(multiple_locations);
  res.json(result);
}


exports.getAllLocations = async (req, res) => {
  console.log("request" + req);
  let all_locations = await Locations.find({});
  res.json(all_locations);
}
exports.getOneLocation = async (req, res) => {
  let id = req.params.id;
  let location = await Locations.findById(id);

  if (!location) {
    return res.status(404).send();
  }

  res.json(location);
}

exports.updateOneLocation = async (req, res) => {
  let location = await Locations.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!location) {
    return res.status(404).send();
  }

  res.json(location);
}

exports.deleteOneLocation = async (req, res) => {
  let deleted_location = await Locations.findByIdAndDelete(req.params.id);

  if (!deleted_location) {
    return res.status(404).send();
  }

  res.json(deleted_location);
}

exports.deleteMultipleLocations = async (req, res) => {
  console.log(req);
  const multiple_locations = req.body;
  let result = await Locations.deleteMany(multiple_locations);
  res.json(result);
}