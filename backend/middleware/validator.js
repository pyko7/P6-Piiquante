const { check } = require("express-validator");

const emailValidator = (req, res, next) => {
  check("email").isEmail;
};

exports.createUser = [
  check("email")
    .isEmail()
    .withMessage("Veuillez entrer une adresse email valide"),
  check("password")
    .isLength({
      min: 3,
    })
    .withMessage("Veuillez entrer un mot de passe valide"),
];
// exports.createUser = [
//   check("email").isEmail(),
//   check("password").matches(
//     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
//     "g"
//   ),
// ];
