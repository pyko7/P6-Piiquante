const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const validator = require("../middleware/validator");

//post routes because app send datas
router.post("/signup", validator.createUser, userController.createUser);
router.post("/login", userController.logUser);

module.exports = router;
