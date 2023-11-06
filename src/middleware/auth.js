const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async(req, res, next)=>{

    try{

        const token = req.cookies.jwt;
        const secretKey = process.env.SECRET_KEY;
        const verifyUser = await jwt.verify(token, secretKey);
        console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id});

        req.token = token;
        req.user = user;

        res.locals.isLoggedIn = true;

        next();

    }catch(err){

        console.log(err);
        res.redirect("/register");
    }

}

module.exports = auth;