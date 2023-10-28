const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000 ;

app.get("/", (req, res)=>{
    res.send("This is a test home page");
});

app.listen(PORT, (err)=>{
    if(err) throw err;
    console.log("The server is running on port: ",PORT);
});