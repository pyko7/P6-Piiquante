const multer = require("multer");
const path = require("path");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//defines where and how save the files
const storage = multer.diskStorage({
  //where files are saved
  destination: (req, file, callback) => {
    //(no error, folder)
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //add underscores instead of spaces
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//file size limit
const limits = {
  files: 1,
  fileSize: 2097152, //2mb limit
};

//check the file extension, if it doesn't fit it sends an error
const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname);
  if (extension !== ".png" && extension !== ".jpg" && extension !== ".jpeg") {
    //using callback error because this is not an exception
    return callback(
      new Error("Seules les images aux formats PNG, JPG et JPEG sont acceptées")
    );
  }
  callback(null, true);
};

//exports single image
module.exports = multer({ storage, limits, fileFilter }).single("image");
