const bcrypt = require('bcrypt');
const jsonToken = require('jsonwebtoken');
const User = require('../models/User');

//creation of new user
exports.signup = (req,res,next) =>{
    //hash password
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        //save user to database
        user.save()
            .then(()=>res.status(201).json({message: 'Utilisateur créé'}))
            .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
};

//login function
exports.login = (req,res,next) =>{
    //find user
    User.findOne({email: req.body.email})
        .then(user =>{
            if(!user){
                //if user doesn't exist
                return res.status(401).json({error: 'Utilisateur non trouvé'})
            }
            //if user exist, compare password
            bcrypt.compare(req.body.password, user.password)
                .then(validPassword =>{
                    //if password is different
                    if(!validPassword){
                        return res.status(401).json({error: 'Mot de passe incorrect'});
                    }
                    //if password valid, user is logged
                    res.status(200).json({
                        userId: user._id,
                        token: jsonToken.sign(
                            //avoid modifications of others user ID
                            {userId: user._id},
                            'TOKEN_LOGIN',
                            {expiresIn: '12h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
};