const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceController.addSauce);
router.get('/', auth, multer, sauceController.getSauce);
router.get('/:id', auth, multer, sauceController.getOneSauce);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, multer, sauceController.deleteSauce);

module.exports = router;