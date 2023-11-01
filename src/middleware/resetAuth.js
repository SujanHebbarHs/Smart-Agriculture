const jwt = require("jsonwebtoken");
const register = require("../models/registers");

const resetAuth = async(req, res, next)=>{

    try{

        const {_id, token} = req.params;
        const secretKey = process.env.SECRET_KEY;

        const verifyUser = await jwt.verify(token, secretKey);
        const user = await register.findOne({_id});

        req.email = verifyUser.email;

        next();

    }catch(err){
        console.log(err);
        res.redirect("/404");
    }

}

module.exports = resetAuth;