const express = require("express");
const routes = require("./routes");
const axios = require("axios");
const cors = require('cors');
const jwt = require("jsonwebtoken");
//const heroku = require("heroku");

require('dotenv').config();
require("./db");

//const api_server_port = process.env.PORT || process.env.api_server_port;
const inventory_server_port = process.env.PORT || process.env.token_server_port;

const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;

//const app = express();
const inventory_app = express();
//app.use(cors());
inventory_app.use(cors());

//app.use(express.json());

//authentication_app.use(express.static(__dirname + "/public"));
inventory_app.use(express.json());

// app.get('/', (req, res) => {
//   res.send(process.env);
// })

inventory_app.get('/', (req,res) => {
  res.redirect('https://github.com/login/oauth/authorize?client_id=bcf3d17d57090637e352');
})

// Declare the redirect route
inventory_app.get("/oauth/redirect", (req, res) => {
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  const requestToken = req.query.code;
  axios({
    // make a POST request
    method: "post",
    // to the Github authentication API, with the client ID, client secret
    // and request token
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSOn
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    // Once we get the response, extract the access token from
    // the response body
    console.log(response.data);
    const accessToken = response.data.access_token;

    //fetch user details
    axios({
      method:"get",
      url:"https://api.github.com/user", 
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "Bearer " + accessToken}
      }).then((response2) => {
      console.log(response2.body);
      const accessToken = generateAccessToken ({user: response2.name});
      const refreshToken = generateRefreshToken ({user: response2.name});
      res.json ({accessToken: accessToken, refreshToken: refreshToken});
    }).catch( (error) => {
      console.log("error2"+error.message);
      res.redirect(`/welcome.html?access_token=${accessToken}`);
    });
     
    // redirect the user to the welcome page, along with the access token
    //res.redirect(`/welcome.html?access_token=${accessToken}`);
  }).catch( (error) => {
    console.log("error1"+error);
  });
});



//REFRESH TOKEN API
inventory_app.post("/refreshToken", (req,res) => {
  if (!refreshTokens.includes(req.body.token))
     res.status(400).send("Refresh Token Invalid");

//remove the old refreshToken from the refreshTokens list  
     refreshTokens = refreshTokens.filter( (c) => c != req.body.token)

//generate new accessToken and refreshTokens
const accessToken = generateAccessToken ({user: req.body.name})
const refreshToken = generateRefreshToken ({user: req.body.name})

res.json ({accessToken: accessToken, refreshToken: refreshToken})
});

  // accessTokens
   function generateAccessToken(user) {
     return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
    }

  // refreshTokens
  let refreshTokens = [];

  function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"});
  refreshTokens.push(refreshToken);
  return refreshToken;
  }

/* tie in routes */
//inventory_app.use("/api/", validateToken, routes); // http://localhost:3000/api/students
inventory_app.use("/api/", routes);
// app.listen(api_server_port, () => {
//   console.log(`Inventory app running on port ${api_server_port}`)
// });

inventory_app.listen(inventory_server_port, () => {
  console.log(`inventory service running on port ${inventory_server_port}`)
});

function validateToken(req, res, next) 
  { 
    //get token from request header
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {if (err) { 
      console.log(err);
      res.status(403).send("Token invalid");
   }
   else {
   req.user = user;
   next(); //proceed to the next action in the calling function
   }}); //end of jwt.verify()
  }//end of function

 module.exports = inventory_app;  