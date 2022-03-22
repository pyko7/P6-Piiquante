const jsonToken = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split('')[1];
        //check if token has same value as the token
        const decodedToken = jsonToken.verify(token, 'TOKEN_LOGIN');
        const userId = decodedToken.userId;
        console.log(userId); //a regarder plus tard
        if(req.body.userId && req.body.userId !== userId){
            //send to catch
            throw 'User ID non valable';
        }else{
            next();
        }
    }catch(error){
        res.status(401).json({error: error})
    }
}