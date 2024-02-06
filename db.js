const mongoose = require("mongoose");

//const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();

const db_user = process.env.mongo_db_username;
const db_password =process.env.mongo_db_password;
const db_host = process.env.mongo_db_hostname;
const db_name = process.env.mongo_db_database;
const credentials = process.env.mongndb_cert_path;


// const client = new MongoClient('mongodb+srv://backend-project.fif0jpf.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
//   tlsCertificateKeyFile: credentials,
//   serverApi: ServerApiVersion.v1
// });



mongoose.connect('mongodb+srv://backend-project.fif0jpf.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', 
{
    tls: true,

  tlsCertificateKeyFile: './cert/mongo_db_client_cert.pem',
  authMechanism: 'MONGODB-X509',
  authSource: '$external'

}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));


//mongoose.connect(`mongodb+srv://${db_user}:${db_password}@${db_host}/?retryWrites=true&w=majority`, {

//mongodb+srv://Admin:<password>@backend-project.fif0jpf.mongodb.net/?retryWrites=true&w=majority"

//mongoose.connection.on('open', () => { console.log("Connected to mongodb") });
