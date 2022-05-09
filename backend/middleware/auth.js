const dotenv = require("dotenv");
dotenv.config();
const USER_LOGIN_TOKEN = process.env.USER_TOKEN_LOGIN;
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //get the token
    const token = req.headers.authorization.split(" ")[1];
    //check if token has same value as the token
    const decodedToken = jwt.verify(token, `${USER_LOGIN_TOKEN}`);
    //get the decoded userID
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ error: error });
  }
};
