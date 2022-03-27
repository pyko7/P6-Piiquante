const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const USER_LOGIN_TOKEN = process.env.USER_TOKEN_LOGIN;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //check if token has same value as the token
    const decodedToken = jwt.verify(token, `${USER_LOGIN_TOKEN}`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      //send to catch
      throw "User ID non valable";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
