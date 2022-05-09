const dotenv = require("dotenv");
dotenv.config();
const USER_LOGIN_TOKEN = process.env.USER_TOKEN_LOGIN;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

//creation of new user
const createUser = (req, res) => {
  //verify if the email is valid and the password input is not empty
  if (
    validator.isEmail(req.body.email, {blacklisted_chars: '$="'}) &&
    !validator.isEmpty(req.body.password, {ignore_whitespace: true})
  ) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //save user to database
      await user
        .save()
        .then(() => res.status(201).json({message: "Utilisateur créé"}))
        .catch((error) => res.status(400).json({ error }));
    });
  } else {
    //if an input is empty or a blacklisted character is present 
    res.status(400).json({error: "Veuillez saisir une adresse email ainsi qu'un mot de passe valide"});
  }
};

const logUser = (req, res) => {
  //find user with the email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        //if user doesn't exist
        return res.status(401).json({error: "Utilisateur non trouvé"});
      }
      //if user exists, password and hash are compared 
      bcrypt.compare(req.body.password, user.password)
        .then((validPassword) => {
          //if password are differents
          if (!validPassword) {
            return res.status(401).json({error: "Mot de passe incorrect"});
          }
          //if password are the same, user is logged
          res.status(200).json({
            //userID in DB
            userId: user._id,
            token: jwt.sign(
              //verify if the userID is the good one
              { userId: user._id },
              `${USER_LOGIN_TOKEN}`,
              { expiresIn: "12h" }
            ),
          });
        })
        //if user tries to login without password
        .catch((error) => res.status(500).json({error})
        );
    })
    .catch((error) => res.status(500).json({error}));
};

module.exports = {
  createUser,
  logUser,
};
