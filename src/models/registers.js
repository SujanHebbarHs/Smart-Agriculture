const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registersSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        default:"United States",
    },
    state:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    bankAcc:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]

});

registersSchema.methods.generateAuthToken = async function(){

    try{

        const payload = {
            _id:this._id.toString()
        };
        const secretKey = process.env.SECRET_KEY;

        const token = await jwt.sign(payload, secretKey);
        this.tokens = this.tokens.concat({token});
        await this.save();
        console.log("Token: "+token);
        return token;


    }catch(err){
        console.log(err);
        throw(err);
    }

}

registersSchema.methods.forgetAuthToken = async function(){

    try{

        const payload = {
            _id: this._id.toString()
        };
        const secretKey = process.env.SECRET_KEY;
        const options = {
            expiresIn: '5m'
        };

        const token = await jwt.sign(payload, secretKey, options);
        console.log("Ftoken: "+token);
        this.tokens = this.tokens.concat({token});
        await this.save();

        return token;

    }catch(err){
        console.log(err);
        throw(err);
    }

}

registersSchema.pre("save", async function (next){

    try{

        if(this.isModified("password")){

            this.password = await bcrypt.hash(this.password, 10);
            console.log("Hash pass: "+this.password);
        }
    
        next();

    }catch(err){
        console.log(err);
        resizeBy.status(500).json({msg:"Password not hased"});
    }

    
    
});

const Register = new mongoose.model("Register", registersSchema);

module.exports = Register;
