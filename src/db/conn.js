const mongoose  = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/buysell")
.then(()=>{
    console.log("Connection to DB successfull.");
})
.catch((err)=>{
        console.log(err);
        console.log("Connection to DB failed.")
    
})