//import express
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//import env variables
const dotenv = require("dotenv");
dotenv.config();
const MY_APP_LOG = process.env.APP_LOG;
const MY_APP_PASSWORD = process.env.APP_PASSWORD;

//import routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

//create express app
const app = express();

mongoose.connect(
  `mongodb+srv://${MY_APP_LOG}:${MY_APP_PASSWORD}@cluster0.cepmx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Connexion à MongoDB réussie");
    else console.log("Connexion à MongoDB échouée");
  }
);

//get content-type: 'json' request
app.use(express.json());

//app can access to API
app.use((req, res, next) => {
  //adding of header - everybody can access to API
  res.setHeader("Access-Control-Allow-Origin", "*");
  //adding of header - can use these headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  //adding of header - can use these methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
//save routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

//give access to app on each files
module.exports = app;
