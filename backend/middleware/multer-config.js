const multer = require('multer');
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//defines where and how save the files
const storage = multer.diskStorage({
    //where files are saved
    destination:(callback)=>{
        //(no error, folder)
        callback(null,'images')
    },
    filename: (file,callback) =>{
        //add _  instead of spaces
        const name = file.originalname.split('').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//exports single image
module.exports = multer({storage}).single('image');