//import express
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

//configures env variables
const dotenv = require("dotenv");
dotenv.config();
const MY_APP_LOG = process.env.APP_LOG;
const MY_APP_PASSWORD = process.env.APP_PASSWORD;

//import routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//create express app
const app = express();
//get content-type: 'json' request
app.use(express.json());
//protect app from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

//the values of MY_APP_LOG and MY_APP_PASSWORD are availables in the .env file
mongoose.connect(
  `mongodb+srv://${MY_APP_LOG}:${MY_APP_PASSWORD}@cluster0.pz8fb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Connexion à MongoDB réussie");
    else console.log("Connexion à MongoDB échouée");
  }
);

//app can access to API - avoid CORS errors
app.use((req, res, next) => {
  //adding of header - everybody can access to API
  res.setHeader("Access-Control-Allow-Origin", "*");
  //adding of header - can use these headers
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  //adding of header - can use these methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  //adding of header - requests from any origin can read the resource
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
//save routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//give access to app on each files
module.exports = app;
