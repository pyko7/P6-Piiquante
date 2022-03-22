const Sauce = require('../models/Sauce');
const fs = require('fs');

//function add a sauce
const addSauce = (req,res,next) =>{
    const sauceObject = JSON.parse(req.body.sauce)
    //delete front ID, DB creates a new ID
    delete sauceObject;
    const sauce = new Sauce({
    //get every input data
      ... sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //save new sauce to DB
    sauce.save()
    .then(() => res.status(201).json({message:'Nouvelle sauce créée'}))
    .catch(err => res.status(400).json({err}))
    };

//function displays all sauces
const getSauce = (req,res, next) =>{
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(err => res.status(400).json({err}))
}

//function displays one sauce
const getOneSauce = (req,res,next) =>{
  Sauce.findOne({_id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(err => res.status(400).json({err}))
}

//function modifies one sauce
const modifySauce = (req,res,next) =>{
  //verify if file exists
  const sauceObject = req.file ?
   {...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : {...req.body};
  Sauce.updateOne({_id: req.params.id}, {... sauceObject, _id: req.params.id})
  .then(() => res.status(200).json({message: 'Sauce supprimée'}))
  .catch(err => res.status(400).json({err}))
}

//function deletes one sauce
const deleteSauce = (req,res,next) =>{
  //find product user wants to delete
  Sauce.findOne({_id: req.params.id})
  .then(sauce =>{
    //get file name, [1] is the image name
    const filename = sauce.imageUrl.split('/images/')[1];
    //delete file
    fs.unlink(`images/${filename}`, ()=>{
      Sauce.deleteOne({_id: req.params.id})
      .then(() => res.status(200).json({message: 'Sauce supprimée'}))
      .catch(err => res.status(400).json({err}))
    });
  })
  .catch(err => res.status(500).json({err}));
}



module.exports = {
    addSauce,
    getSauce,
    getOneSauce,
    modifySauce,
    deleteSauce
}