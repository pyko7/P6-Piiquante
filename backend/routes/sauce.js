const express = require("express");
const router = express.Router();

const sauceController = require("../controllers/sauce");
const auth = require("../middleware/auth");
const userCompare = require("../middleware/userCompare");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, sauceController.addSauce);
router.get("/", auth, multer, sauceController.getSauce);
router.get("/:id", auth, multer, sauceController.getSauceById);
router.put("/:id", auth, userCompare, multer, sauceController.updateSauce);
router.delete("/:id", auth, userCompare, multer, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeDislikeSauce);

module.exports = router;
