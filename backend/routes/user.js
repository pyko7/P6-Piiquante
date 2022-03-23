const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

//post routes because app send datas
router.post("/signup", userController.createUser);
router.post("/login", userController.logUser);

module.exports = router;
