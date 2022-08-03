const express = require("express");
const routes = require("./routes");
require('dotenv').config();
require("./db");

const port = process.env.port||3000;

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send(process.env);
// })

/* tie in routes */
app.use("/api/", routes); // http://localhost:3000/api/students

app.listen(port, () => {
  console.log(`Inventory app running on port ${port}`)
});