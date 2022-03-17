//import express
const express = require('express');
const mongoose = require('mongoose');

//import routes
const userRoutes = require('./routes/user');

//create express app
const app = express();

mongoose.connect('mongodb+srv://pyk:1L19pY2S5BwlCxVJ@cluster0.cepmx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(() => console.log('Connexion à MongoDB échouée'));

//get body of request
app.use(express.json());

//app can access to API
app.use((req, res, next)=>{
    //adding of header - everybody can access to API
    res.setHeader('Access-Control-Allow-Origin', '*');
    //adding of header - can use these headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //adding of header - can use these methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//save routes
app.use('/api/auth', userRoutes);

//give access to app on each files
module.exports = app;