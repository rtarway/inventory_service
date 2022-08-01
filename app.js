const express = require("express");
const routes = require("./routes");
require("./db");

const app = express();

app.use(express.json());

/* tie in routes */
app.use("/api/", routes); // http://localhost:3000/api/students

app.listen(3000, () => {
  console.log("Inventory app running on port 3000")
});