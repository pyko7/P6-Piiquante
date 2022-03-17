const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

//save to disk
const storage = multer.diskStorage({
    //defines destination
    destination: (req,file, callback) =>{
        callback(null, 'images')
    },
    //defines file name
    filename: (req, file, callback) =>{
        //remove space to file name
        const name = file.originalname.split('').join('_');
        //create file extension
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now()+'.'+ extension)
    }
});

//exports 1 image file
module.exports = multer({storage}).single('image');