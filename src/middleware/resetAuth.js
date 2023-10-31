const jwt = require("jsonwebtoken");
const register = require("../models/registers");

const resetAuth = async(req, res, next)=>{

    try{

        const token = req.query.token;
        const secretKey = process.env.SECRET_KEY;

        const verifyUser = await jwt.verify(token, secretKey);
        const user = await register.findOne({_id: verifyUser._id});

        req.token = token;

        next();

    }catch(err){
        console.log(err);
        throw err;
    }

}

module.exports = resetAuth;