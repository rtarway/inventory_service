const mongoose = require("mongoose");
require('dotenv').config();

const db_user = process.env.mongo_db_username;
const db_password  =process.env.mongo_db_password;
const db_host = process.env.mongo_db_hostname;
const db_name = process.env.mongo_db_database;

mongoose.connect(`mongodb+srv://${db_user}:${db_password}@${db_host }/${db_name}?retryWrites=true&w=majority`);

mongoose.connection.on('open', () => { console.log("Connected to mongodb") });
