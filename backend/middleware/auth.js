const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        //check if token has same value as the token
        const decodedToken = jwt.verify(token, 'TOKEN_VERY_SECRET');
        const userId = decodedToken.userId;
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