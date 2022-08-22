const express = require("express");
const routes = require("../routes");
const request = require("supertest");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");



const test_app = express();

test_app.use(express.json());
test_app.use(bodyParser.urlencoded({ extended: false }));
test_app.use(bodyParser.json());
test_app.use("/api/", routes);
test_app.use(express.urlencoded({ extended: false }));

  
beforeAll(() => {
  
require('dotenv').config();

const db_user = process.env.mongo_db_username;
const db_password  =process.env.mongo_db_password;
const db_host = process.env.mongo_db_hostname;
const db_name = process.env.mongo_db_database;

mongoose.connect(`mongodb+srv://${db_user}:${db_password}@${db_host }/${db_name}?retryWrites=true&w=majority`);

mongoose.connection.on('open', () => { console.log("Connected to mongodb") });
});

// afterAll(() => {
//    mongoose.connection.close(true);
// });

describe('All Location related endpoints testing', () => {

  test("TestGetAllLocations", async () => {
    await request(test_app).get("/api/locations")
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(7);
  
        // Check data
        expect(response.body[0]._id).toBe("store001");
      });
  });

  test("TestGetLocation", async () => {
    await request(test_app).get("/api/locations/store007")
      .then((response) => {
        // Check type and length
        //expect(Array.isArray(response.body)).toBe();
        //expect(response.body.length).toEqual(1);
  
        // Check data
        expect(response.body._id).toBe("store007");
      });
  });

});

describe('All TestAllAvailability related endpoints testing', () => {

  test("getATP", async () => {

    const reqBody = {"SKU":"100010","location":"store001"};

    await request(test_app).get("/api/availability/atp").send(reqBody)
      .then((response) => {
        // Check type and length
        expect(response.body.SKU).toBe("100010");
        expect(response.body.location).toBe("store001");
        expect(response.body.status).toBe(true);
        //expect(response.body.length).toEqual(7);
  
        // Check data
        //expect(response.body[0]._id).toBe("store001");
      });
  });
});
