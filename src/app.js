require("dotenv").config();
const express = require("express");
require("./db/conn.js");
const register = require("./models/registers.js");
const path = require("path");
const auth = require("./middleware/auth.js");
const resetAuth = require("./middleware/resetAuth.js");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT || 3000 ;

app.get("/", (req, res)=>{
    res.send("This is a test home page");
});

app.post("/register", async(req, res)=>{
    try {
        password = req.body.password;
        cpassword = req.body.cpassword;

        bankAcc= req.body.bankAcc;
        CbankAcc= req.body.CbankAcc;

        if(password === cpassword && bankAcc === CbankAcc ){
            
            const signup = new register({
                name : req.body.name,
                email: req.body.email,
                password: password,
                state: req.body.state,
                bankAcc: bankAcc,
                address: req.body.address,
                role: req.body.role,
            });
    
            const token = signup.generateAuthToken();

            const resp = await signup.save();
            console.log(resp);
            res.redirect("/login");

        }
        else{
            res.send("password dont match");
        }

    } catch(err){
        console.log(err);
        res.status(500).json({msg:"Registration failed"});
    }
});

app.post("/login", async(req, res)=>{

    try{

        const email = req.body.email;
        const password = req.body.password;

        const user = await register.findOne({email});

        if(user == null){
            res.status(400).json({msg:"Email not registered"});
            return;
        }

        const match = await bcrypt.compare(password, user.password);

        if(match){

            const token = user.generateAuthToken();

            res.cookie("jwt",token,{
                httpOnly:true
            });

            res.status(201).render("index");

        }
        else{
            res.status(400).json({msg:"Email or password is incorrect"});
            return;
        }


    }catch(err){

        console.log(err);
        res.status(500).json({msg:"Server Error"});
    }

});

app.post("/forget",async(req,res)=>{

    try{

        const email = req.body.email;

        const user = await register.findOne({email});

        if(user == null){
            res.status(400).json({msg:"User not found"});
            return;
        }

        const token = user.forgetAuthToken();
        res.clearCookie("jwt");
       //Write email with link 
       res.send("<h1>Check mail for the link to reset password...</h1>");

    }catch(err){

        console.log(err);
        res.status(500).json({msg:"Server Error"});

    }

})

app.get("/reset-password",resetAuth,(req, res)=>{

    res.status(201).render("reset",{
        token:req.token
    });

});

app.put("/reset-password", async(req ,res)=>{

    try{

        const {token, password} = req.body;
        const secretKey = process.env.SECRET_KEY;
        const verifyUser = await jwt.verify(token, secretKey);
        const user = await findByIdAndUpdate({_id: verifyUser._id},{$set:{password}},{new:true});

        res.send("<h1>Password Updated successfull</h1>");
        
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server Error"});
    }

});

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("The server is running on port: ",PORT);
});