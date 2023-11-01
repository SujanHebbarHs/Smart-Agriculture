require("dotenv").config();
require("./db/conn.js");
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hbs = require("hbs");
const nodemailer = require("nodemailer");
const register = require("./models/registers.js");
const auth = require("./middleware/auth.js");
const resetAuth = require("./middleware/resetAuth.js");

const app = express();

const PORT = process.env.PORT || 3000 ;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates", "views");
const partials_path = path.join(__dirname, "../templates", "partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res)=>{
    res.send("This is a test home page");
});

app.get("/register", (req, res)=>{

    res.render("signup");
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

app.get("/login", (req, res)=>{

    res.render("login");
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

app.get("/forget", (req, res)=>{

    res.render("forget");
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
        const link = `http://localhost:${PORT}/reset-password/${user._id}/${token}`;
        
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: "sharathchandrasharath00007@gmail.com",
              pass: "ayut ykun fibu dsbb",
            },
        });
    
        const mailOptions = {
            from: '"Support" <supportcustomer@gmail.com>',
            to: "luffyhebbarhs@gmail.com",
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

app.get("/reset-password/:id/:token",resetAuth,(req, res)=>{

    res.render("reset",{
        token:req.params.token,
        email: req.email
    });

});

app.put("/reset-password/:token", async(req ,res)=>{

    try{

        const {password, cpassword} = req.body;
        const token = req.params.token;

        if(password !== cpassword){
            res.status(400).json({msg:"Password dont match"});
            return;
        }

        const secretKey = process.env.SECRET_KEY;
        const verifyUser = await jwt.verify(token, secretKey);
        const user = await findByIdAndUpdate({_id: verifyUser._id},{$set:{password}},{new:true});

        res.render("/login");
        
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server Error"});
    }

});

app.get("/logout", auth, async(req, res)=>{

    try{

        req.clearCookie("jwt");
        req.user.tokens = [];

        await req.user.save();
        res.redirect("/login");

    }catch(err){

        req.clearCookie("jwt");
        res.sendStatus(500);
    }
    
});


app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("The server is running on port: ",PORT);
});