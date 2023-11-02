const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const resetAuth = async(req, res, next)=>{

    try{

        const {_id, token} = req.params;
        const secretKey = process.env.SECRET_KEY;

        const verifyUser = await jwt.verify(token, secretKey);
        const user = await Register.findById({_id});

        req.email = user.email;
        console.log(req.email);

        next();

    }catch(err){
        console.log(err);
        res.redirect("/404");
    }

}

module.exports = resetAuth;