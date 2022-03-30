const dotenv = require("dotenv");
dotenv.config();
const USER_LOGIN_TOKEN = process.env.USER_TOKEN_LOGIN;

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//creation of new user
const createUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({
      errors: "Veuillez vérifier vos champs de texte",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //save user to database
      user.save((error, docs) => {
        if (!error) res.status(201).json({ message: "Utilisateur créé" });
        else (error) => res.status(500).json({ error: "test ici" });
      });
    })
    .catch((error) =>
      res.status(500).json({
        //if user tries to sign up with empty inputs
        error:
          "Une erreur est survenue lors de la tentative de connexion, veuillez réessayer",
      })
    );
};

const logUser = (req, res) => {
  //find user
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        //if user doesn't exist
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      //if user exist, compare password
      bcrypt
        .compare(req.body.password, user.password)
        .then((validPassword) => {
          //if password is different
          if (!validPassword) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          //if password valid, user is logged
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              //avoid modifications of others user ID
              { userId: user._id },
              `${USER_LOGIN_TOKEN}`,
              { expiresIn: "12h" }
            ),
          });
        })
        .catch((error) =>
          res.status(500).json({
            //if user tries to login without password
            error:
              "Une erreur est survenue lors de la tentative de connexion, veuillez réessayer",
          })
        );
    })
    .catch((error) => res.status(500).json({ error: "erreur là" }));
};

module.exports = {
  createUser,
  logUser,
};
