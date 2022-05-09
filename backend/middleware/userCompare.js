const dotenv = require("dotenv");
dotenv.config();
const USER_LOGIN_TOKEN = process.env.USER_TOKEN_LOGIN;
const jwt = require("jsonwebtoken");
const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //get the token
      const token = req.headers.authorization.split(" ")[1];
      //check if token has same value as the token
      const decodedToken = jwt.verify(token, `${USER_LOGIN_TOKEN}`);
      //get the decoded userID
      const userId = decodedToken.userId;

      // Compare sauce userId & token's one
      if (sauce.userId && sauce.userId !== userId) {
        res.status(403).json({ error });
      } else {
        next();
      }
    })
    .catch((error) => {
      res.status(401).json({ error });
    });
};
