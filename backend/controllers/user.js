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
    validator.isEmail(req.body.email, { blacklisted_chars: '$="' }) &&
    !validator.isEmpty(req.body.password, {
      ignore_whitespace: true,
    })
  ) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //save user to database
      await user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(() =>
          res.status(400).json({ message: "L'adresse email est déjà utilisée" })
        );
    });
  } else {
    res.status(400).json({
      error:
        "Veuillez saisir une adresse email ainsi qu'un mot de passe valide",
    });
  }
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
    .catch((error) => res.status(500).json({ error }));
};

module.exports = {
  createUser,
  logUser,
};
