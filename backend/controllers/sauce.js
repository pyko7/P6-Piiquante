const Sauce = require("../models/Sauce");
const validator = require("validator");
const path = require("path");
const fs = require("fs");


//function add a sauce
const addSauce = (req, res, next) => {
  let validInput = true;
  const sauceObject = JSON.parse(req.body.sauce);
  const sauceArray = Object.values(sauceObject);
  //delete front ID, DB creates a new ID
  delete sauceObject._id;

  /**
   *  loop checks if inputs are valid before creating the sauce
   *  you'll have to comment this loop if you want to test this function on postman otherwise
   *  it will return you an error because of the empty fields
   */
  for (value in sauceArray) {
    if (
      validator.isEmpty(sauceArray[value].toString(), {
        ignore_whitespace: true,
      }) ||
      validator.contains(sauceArray[value].toString(), "$") ||
      validator.contains(sauceArray[value].toString(), "=")
    ) {
      console.log("Vérifer le champ: " + sauceArray[value]);
      validInput = false;
    }
  }

  if(!validInput){
    //delete image if the form is not valid
    fs.unlink(path.join(`${req.file.path}`), (err) => console.log(err));
    res.status(400).json({
      error:
        "Nous n'avons pas pu créer votre sauce, veuillez vérifier la validité de vos champs",
    });
    return
  }

    //if every input is valid, the sauce is created
    const sauce = new Sauce({
      //get every input data
      ...sauceObject,
      //image url = http + localhost + images folder + image name + filename
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    //save new sauce to DB
    return sauce
      .save()
      .then(() => res.status(201).json({ message: "Nouvelle sauce créée" }))
      .catch((err) => res.status(400).json({ err }));

};


//function displays all sauces
const getSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(400).json({ err }));
};

//function displays one sauce
const getSauceById = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(400).json({ err }));
};

//function modifies one sauce
const updateSauce = (req, res, next) => {
  let validInput = true;

  //verify if file exists
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //if image doesn't change, it gets new inputs informations
      { ...req.body };

  const sauceArray = Object.values(sauceObject);
    /**
   *  loop checks if inputs are valid before creating the sauce
   *  you'll have to comment this loop if you want to test this function on postman otherwise
   *  it will return you an error because of the empty fields
   */
  for (value in sauceArray) {
    if (
      validator.isEmpty(sauceArray[value].toString(), {
        ignore_whitespace: true,
      }) ||
      validator.contains(sauceArray[value].toString(), "$") ||
      validator.contains(sauceArray[value].toString(), "=")
    ) {
      console.log("Vérifer le champ: " + sauceArray[value]);
      validInput = false;
    }
  }

  //delete previous image if a new image is uploaded
  if (req.file && validInput) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }

  if(!validInput){
    fs.unlink(path.join(`${req.file.path}`), (err) => console.log(err));
    res
      .status(400)
      .json({ error: "Veuillez vérifier la validité de vos champs de texte" });
      return
  }

    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée" }))
      .catch((err) => res.status(400).json({ err }));
};

//function deletes one sauce
const deleteSauce = (req, res, next) => {
  //find product user wants to delete
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //get file name, [1] is the image name
      const filename = sauce.imageUrl.split("/images/")[1];
      //delete file
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((err) => res.status(400).json({ err }));
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

const likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        //user likes sauce
        case 1:
          //if includes doesn't find userID in likes array and user likes the product
          if (
            !sauce.usersLiked.includes(req.body.userId) &&
            req.body.like === 1
          ) {
            Sauce.updateOne(
              { _id: req.params.id },
              //`inc` increments likes value, `push` pushes the value into likes array
              {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
              }
            )
              .then(() =>
                res.status(201).json({
                  message: `Vous aimé cette sauce`,
                })
              )
              .catch((err) => res.status(400).json({ err }));
          }
          console.log(req.body.like);
          break;
        //user cancels like/dislike
        case 0:
          //if includes finds userID in likes array and user likes the product
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              //`inc` decreases likes value, `pull` removes the value from likes array
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() =>
                res.status(200).json({ message: `Le like a été annulé` })
              )
              .catch((err) => res.status(400).json({ err }));
          }
          //if includes finds userID in dislikes array and user dislikes the product
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              //`inc` decreases dislikes value, `pull` removes the value from dislikes array
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() =>
                res.status(200).json({ message: `Le dislike a été annulé` })
              )
              .catch((err) => res.status(400).json({ err }));
          }
          console.log(req.body.like);

          break;
        //user dislikes sauce
        case -1:
          //if includes doesn't find userID in dislikes array and user dislikes the product
          if (
            !sauce.usersDisliked.includes(req.body.userId) &&
            req.body.like === -1
          ) {
            Sauce.updateOne(
              { _id: req.params.id },
              //`inc` increments dislikes value, `push` pushes the value into dislikes array
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(() =>
                res
                  .status(201)
                  .json({ message: `Vous n'aimez pas cette sauce` })
              )
              .catch((err) => res.status(400).json({ err }));
          }
          console.log(req.body.like);

          break;

        default:
          console.log("Une erreur est intervenue");
      }
    })
    .catch((err) => res.status(400).json({ err }));
};

module.exports = {
  addSauce,
  getSauce,
  getSauceById,
  updateSauce,
  deleteSauce,
  likeDislikeSauce,
};
