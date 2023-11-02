require("dotenv").config();
require("./db/conn.js");
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hbs = require("hbs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const Register = require("./models/registers.js");
const auth = require("./middleware/auth.js");
const resetAuth = require("./middleware/resetAuth.js");

const app = express();

const PORT = process.env.PORT || 3000 ;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates", "views");
const partials_path = path.join(__dirname, "../templates", "partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/test", auth, (req, res)=>{
    res.send("Secret");
});

app.get("/register", (req, res)=>{

    res.render("registration");
});

app.post("/register", async(req, res)=>{
    
    try {
        console.log("Inside");
        password = req.body.password;
        cpassword = req.body.cpassword;

        bankAcc= req.body.bankAcc;
        CbankAcc= req.body.CbankAcc;

        if(password === cpassword && bankAcc === CbankAcc ){
            
            const signup = new Register({
                name : req.body.name,
                email: req.body.email,
                password,
                state: req.body.state,
                bankAcc,
                address: req.body.address,
                role: req.body.role,
            });
    
            const token = await signup.generateAuthToken();
            console.log(signup._id);
            console.log(signup.password);

            // const resp = await signup.save();
            // console.log(resp);
            res.redirect("/register");

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

        const user = await Register.findOne({email});

        if(user == null){
            res.status(400).json({msg:"Email not registered"});
            return;
        }

        const match = await bcrypt.compare(password, user.password);

        if(match){

            const token = await user.generateAuthToken();

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

app.get("/forget", (req, res)=>{

    res.render("forget");
});

app.post("/forget",async(req,res)=>{

    try{

        const email = req.body.email;

        const user = await Register.findOne({email});

        if(user == null){
            res.status(400).json({msg:"User not found"});
            return;
        }

        const token = await user.forgetAuthToken();
        res.clearCookie("jwt");
        const link = `http://localhost:${PORT}/reset-password/${user._id}/${token}`;
        
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: process.env.EMAIL_HOST,
              pass: process.env.EMAIL_PASS,
            },
        });
    
        const mailOptions = {
            from: '"Support" <supportcustomer@gmail.com>',
            to: email,
            subject: "Reset Password",
            text: `You have requested to reset your password. Click on the link to reset your password ${link}`,
        }
        
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
        res.send("<h1>Check mail for the link to reset password...</h1>");

    }catch(err){

        console.log(err);
        res.status(500).json({msg:"Server Error"});

    }

});

app.get("/reset-password/:_id/:token",resetAuth,(req, res)=>{

    res.render("reset",{
        token:req.params.token,
        email: req.email
    });

});

app.post("/reset-password/:token", async(req ,res)=>{

    try{

        let {password, cpassword} = req.body;
        const token = req.params.token;

        
        if(password !== cpassword){
            res.status(400).json({msg:"Password dont match"});
            return;
        }
        password = await bcrypt.hash(password, 10);

        const secretKey = process.env.SECRET_KEY;
        const verifyUser = await jwt.verify(token, secretKey);


        const user = await Register.findByIdAndUpdate({_id: verifyUser._id},{$set:{password}});
        console.log(user);
        console.log("password: "+password);
        console.log("Password reset successfull");

        res.redirect("/register");
        
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server Error"});
    }

});

app.get("/logout", auth, async(req, res)=>{

    try{

        res.clearCookie("jwt");
        req.user.tokens = [];

        await req.user.save();
        res.redirect("/register");

    }catch(err){
        console.log(err);
        res.sendStatus(500);

    }
    
});

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("The server is running on port: ",PORT);
});