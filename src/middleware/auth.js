const jwt = require("jsonwebtoken");
const register = require("../models/registers");

const auth = async(req, res, next)=>{

    try{

        const token = req.cookie.jwt;
        const secretKey = process.env.SECRET_KEY;
        const verifyUser = await jwt.verify(token, secretKey);
        console.log(verifyUser);
        const user = await register.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;

        next();

    }catch(err){

        console.log(err);
        res.redirect("/login");
    }

}

module.exports = auth;