require("dotenv").config();
require("./db/conn.js");
const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const hbs = require("hbs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cookieParser = require("cookie-parser");

const Register = require("./models/registers.js");
const Product = require("./models/products.js");
const Order = require("./models/orders.js");
const OrderHsitory = require("./models/orderHistory.js");
const RemovedUser = require("./models/removedUsers.js");
const auth = require("./middleware/auth.js");
const adminAuth = require("./middleware/adminAuth.js");
const resetAuth = require("./middleware/resetAuth.js");

const app = express();

const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates", "views");
const partials_path = path.join(__dirname, "../templates", "partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


const storage = require("./components/multer.js");
const upload = multer({ storage });

app.get("/", (req, res) => {

    res.render("index");
});


// /home page after login
app.get("/home", auth, (req, res) => {

    res.render("index");

});
// /register page 
app.get("/register", (req, res) => {

    res.render("registration");
});

app.get("/registerSuccess", (req, res) => {

    const toastMsg = "liveToast";

    res.render("registration", {
        toastID: toastMsg
    })

})

app.post("/removedUsersList", async (req, res) => {

    try {

        const _id = req.body.id;
        console.log("The id is: " + _id);
        const removedUser = await Register.findById({_id});
        console.log("Dil vich tere liye tem kadke")
        console.log(removedUser);

        if(removedUser){
            console.log("Inside Suj ass");

            const response = new RemovedUser({
                email: removedUser.email
            });

            const resp = await response.save();
           
            res.json({msg: "User added to removed list", condition: true});
            return;


        }
        else{
            res.json({msg: "User not found", condition: false});
            return;
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

});

//registration 
app.post("/register", async (req, res) => {

    try {
        console.log("Inside");
        password = req.body.password;
        cpassword = req.body.cpassword;

        bankAcc = req.body.bankAcc;
        CbankAcc = req.body.CbankAcc;

        if (password === cpassword && bankAcc === CbankAcc) {

            const removedUsers = await RemovedUser.findOne({ email: req.body.email });

            if (removedUsers == null) {

                const userExists = await Register.findOne({ email: req.body.email });

                if (userExists == null) {

                    const signup = new Register({
                        name: req.body.name,
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

                    res.json({ msg: "Regsitration successfull!.", condition: true });

                }
                else {
                    res.json({ msg: "Account with this email ID already exists. Proceed to login.", condition: false });
                }

            }
            else {
                
                res.json({ msg: "This account has been banned for suspicious activity. Please contact customer support.", condition: false });

            }

        }
        else {
            res.json({ msg: "Password doesn't match!.", condition: false });
        }

    } catch (err) {

        console.log(err);
        res.json({ msg: "Regsitration failed!." }, { condition: false });
    }
});

app.post("/login", async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email });

        if (user == null) {
            res.json({ msg: "No account linked to this email. Please register before continuing.", condition: false });
            return;
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {

            const token = await user.generateAuthToken();

            res.cookie("jwt", token, {
                httpOnly: true
            });

            if (user.role == "admin") {
                res.json({ msg: "Admin Login successfull", condition: true, privilege: true });
            }
            else {
                res.json({ msg: "Login successfull", condition: true });
            }

        }
        else {
            res.json({ msg: "Email or password is incorrect.", condition: false });
            return;
        }

    } catch (err) {

        console.log(err);
        res.status(500).json({ msg: "Couldn't fetch the details at the moment. Please try again later.", condition: false });
    }

});

app.get("/forget", (req, res) => {

    res.render("forget");
});

app.post("/forget", async (req, res) => {

    try {

        const email = req.body.email;

        const user = await Register.findOne({ email });

        if (user == null) {
            res.status(400).json({ msg: "User not found" });
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

    } catch (err) {

        console.log(err);
        res.status(500).json({ msg: "Server Error" });

    }

});

app.get("/reset-password/:_id/:token", resetAuth, (req, res) => {

    res.render("reset", {
        token: req.params.token,
        email: req.email
    });

});

app.post("/reset-password/:token", async (req, res) => {

    try {

        let { password, cpassword } = req.body;
        const token = req.params.token;


        if (password !== cpassword) {
            res.status(400).json({ msg: "Password dont match" });
            return;
        }
        password = await bcrypt.hash(password, 10);

        const secretKey = process.env.SECRET_KEY;
        const verifyUser = await jwt.verify(token, secretKey);


        const user = await Register.findByIdAndUpdate({ _id: verifyUser._id }, { $set: { password } });
        console.log(user);
        console.log("password: " + password);
        console.log("Password reset successfull");

        res.redirect("/register");

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }

});

app.get("/allUsers", adminAuth, async (req, res) => {

    try {

        const allUsers = await Register.find({ $or: [{ role: "buyer" }, { role: "seller" }] });
        res.json(allUsers);


    } catch (err) {
        console.log(err);
        res.json({ msg: "Could't fetch users data", condition: false });
    }


});

app.get("/dashboard", auth, (req, res) => {

    console.log(req.user.role);

    if (req.user.role == "buyer") {

        res.render("buyerDashboard");

    }
    else if (req.user.role == "seller") {

        res.render("sellerDashboard");

    }
    else {
        res.sendStatus(500);
    }


});

app.get("/profile", auth, (req, res) => {

    const profile = req.user;

    const name = profile.name;
    const email = profile.email;
    const state = profile.state;
    const address = profile.address;
    const bankAcc = profile.bankAcc;
    const role = profile.role;

    res.render("profile", {
        name,
        email,
        state,
        address,
        bankAcc,
        role,
    });

});



app.post("/addProducts", upload.single('image'), auth, async (req, res) => {

    try {
        const Name = req.body.name;
        const name = Name.toLowerCase();

        const items = new Product({

            name,
            owner: req.user._id,
            price: req.body.price,
            category: req.body.category,
            img: req.file.filename,

        });


        const resp = await items.save();
        res.redirect("/dashboard");

    } catch (err) {

        console.log(err);
        res.status(500).json({ msg: "Sorry we couldn't add your Product. Make sure to fill all the fields and try again.", state: false });
    };

});

app.get("/search/:word", async (req, res) => {

    const search_name = req.params.word;
    console.log("Name is: " + search_name);

    const products = await Product.find({ name: { $regex: search_name } });
    // console.log(products);
    res.json(products);

});

app.get("/requests", auth, (req, res) => {

    res.render("requests");

});



app.get("/listings", async (req, res) => {

    try {

        const list = await Product.find({});
        // console.log(list);

        res.json(list);

    } catch (err) {

        console.log(err);
        res.sendStatus(500);
    }

});

app.get("/myListingsPage", auth, (req, res) => {

    res.render("listingPage");

});

app.delete("/myListings/:id", auth, async (req, res) => {

    try {

        const _id = req.params.id;
        const resp = await Product.findByIdAndDelete({ _id });
        res.json({ msg: "Deleted successfully" });

    } catch (err) {

        console.log(err);
        res.sendStatus(500);

    }

});

app.get("/myListings", auth, async (req, res) => {

    try {

        const myList = await Product.find({ owner: req.user._id }, { owner: 0 });
        console.log(myList);
        res.json(myList);


    } catch (err) {

        console.log(err);
        res.sendStatus(500);

    }

});

app.post("/orders", auth, async (req, res) => {

    try {

        const productId = req.body.id;
        console.log("The id in server is: " + productId);
        const quantity = req.body.quantity;

        const buyer = req.user;

        const product = await Product.findById({ _id: productId });


        const ordersCart = new Order({

            productId,
            pName: product.name,
            buyerId: buyer._id,
            buyerName: buyer.name,
            ownerId: product.owner,
            price: product.price,
            category: product.category,
            img: product.img,
            quantity,

        });

        const orderResp = await ordersCart.save();
        console.log(orderResp);

        const orderHistoryCart = new OrderHsitory({

            productId,
            pName: product.name,
            buyerId: req.user._id,
            buyerName: req.user.name,
            ownerId: product.owner,
            price: product.price,
            category: product.category,
            img: product.img,

        })

        const orderHistoryResp = await orderHistoryCart.save();
        console.log(orderHistoryResp);

        res.json({ msg: "Added successfully", state: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Sorry we couldn't add the requested product to your cart" });
    }

});

//To unordered in cart
app.get("/orders", auth, async (req, res) => {

    try {

        const myOrders = await Order.find({ buyerId: req.user._id, status: "Pending" });
        console.log(myOrders);
        res.json(myOrders);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

});

app.delete("/orders/:id", auth, async (req, res) => {

    try {

        const id = req.params.id;

        const resp = await Order.deleteOne({ productId: id });
        const resp2 = await OrderHsitory.deleteOne({ productId: id });

        res.json({ msg: "Deleted", state: true });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

});


app.get("/cart", auth, (req, res) => {
    res.render("cart");
});

app.post("/cart", auth, async (req, res) => {

    try {

        const productId = req.body.productId;
        const orderId = req.body.orderId;
        const quantity = req.body.quantity;
        const totalPrice = req.body.totalPrice;

        const resp = await Order.findByIdAndUpdate({ _id: orderId }, { $set: { quantity, totalPrice } });
        console.log(resp);
        const orderH = await OrderHsitory.findOne({ productId, buyerId: req.user._id, status: "Pending" });
        console.log("Is this null" + orderH);
        const resp2 = await OrderHsitory.findByIdAndUpdate({ _id: orderH._id }, { $set: { quantity, totalPrice } });
        console.log(resp2);

        res.json({ msg: "Sent requested to seller", state: true });

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

});

app.get("/payment", auth, async(req, res)=>{

    res.render("payment");

});

app.post("/payment", auth, async(req, res)=>{

    try{

        const resp = await Order.updateMany({buyerId: req.user._id}, {$set:{status: "Waiting"}});
        const resp2 = await OrderHsitory.updateMany({buyerId: req.user._id}, {$set:{status: "Waiting"}});

        res.json({msg: "Updated status to waiting", condition:true});

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

});


app.get("/orderRequests", auth, async (req, res) => {

    try {

        const requests = await Order.find({ ownerId: req.user._id, status: "Waiting" });
        console.log(requests);
        res.json(requests);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.get("/approval/:id", auth, async (req, res) => {
    try {

        const orderId = req.params.id;
        const order = await Order.findById({ _id: orderId });

        const pName = order.pName;

        const buyerEmail = await Register.findById({ _id: order.buyerId }, { email: 1, _id: 0 });
        console.log(buyerEmail);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.EMAIL_HOST,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: '"Smart Agriculture" <supportcustomer@gmail.com>',
            to: buyerEmail,
            subject: "Order Confirmed",
            text: `Your order for ${pName} has been confirmed. Your order id is ${orderId}. `,
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(info);

        await Order.findByIdAndDelete({ _id: orderId });
        await OrderHsitory.findOneAndUpdate({ ownerId: req.user._id, productId: order.productId, buyerId: order.buyerId }, { $set: { status: "Approved" } });

        res.json({ msg: "Approved" });

    } catch (err) {
        console.log(err);
        res.sendStatus(err);
    }
});

app.get("/disapprove/:id", auth, async (req, res) => {
    try {

        const orderId = req.params.id;
        const order = await Order.findById({ _id: orderId });
        const pName = order.pName;

        const buyerEmail = await Register.findById({ _id: order.buyerId }, { email: 1, _id: 0 });
        console.log(buyerEmail);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.EMAIL_HOST,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: '"Smart Agriculture" <supportcustomer@gmail.com>',
            to: buyerEmail,
            subject: "Order Rejected",
            text: `Your order for ${pName} has been Rejected. Send mail to ${process.env.EMAIL_HOST} for any querry `,
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(info);

        await Order.findByIdAndDelete({ _id: orderId });
        await OrderHsitory.findOneAndUpdate({ ownerId: req.user._id, productId: order.productId, buyerId: order.buyerId }, { $set: { status: "Rejected" } });


        res.json({ msg: "Rejected" });

    } catch (err) {
        console.log(err);
        res.sendStatus(err);
    }
});

app.get("/orderHistoryList", auth, (req, res) => {

    res.render("orderhistory");

});

app.get("/orderHistory", auth, async (req, res) => {
    try {

        const orderHistory = await OrderHsitory.find({ buyerId: req.user._id });
        console.log(orderHistory);
        res.json(orderHistory);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/adminLogin", adminAuth, (req, res) => {

    res.render("AdminDashboard");

});

app.delete("/adminDeleteUser/:id", adminAuth, async (req, res) => {

    try {

        const userId = req.params.id;

        console.log("The id is: " + userId);
        const user = await Register.findById({ _id: userId });

        if (user) {

            const orderRemove = await Order.deleteMany({ $or: [{ buyerId: user._id }, { ownerId: user._id }] });
            const orderHistoryUpdate = await OrderHsitory.updateMany({ $or: [{ buyerId: user._id }, { ownerId: user._id }] }, { $set: { status: "Unavaliable" } });
            const productRemove = await Product.deleteMany({ owner: user._id });
            const userRemove = await Register.findByIdAndDelete({ _id: user._id });


            //Sending mail to user about account deletion
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                    user: process.env.EMAIL_HOST,
                    pass: process.env.EMAIL_PASS,
                },
            });
    
            const mailOptions = {
                from: '"Smart Agriculture" <supportcustomer@gmail.com>',
                to: user.email,
                subject: "Account Suspended",
                text: `We regret to inform you that your account has been suspended due to detected suspicious activity. Contact ${process.env.EMAIL_HOST} for any query.`,
            }
    
            const info = await transporter.sendMail(mailOptions);
            console.log(info);

            res.json({ msg: "Deleted user successfully", condition: true });

        }
        else {

            console.log("User not found");
            res.json({ msg: "User not found.", condition: false });

        }

    } catch (err) {

        console.log(err);
        res.json({ msg: "User not deleted", condition: false });

    }


});

app.get("/logout", auth, async (req, res) => {

    try {

        res.clearCookie("jwt");
        req.user.tokens = [];

        await req.user.save();
        res.redirect("/register");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);

    }
});



app.get("*", (req, res) => {
    res.render("404");
});


app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("The server is running on port: ", PORT);
});