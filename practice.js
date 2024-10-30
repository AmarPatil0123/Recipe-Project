const express = require("express");
const app = express();
const ExpressError=require("./ExpressError");

app.listen("8080", () => {
    console.log("Server listening on port 8080");
});

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

app.get("/checks",wrapAsync(async(req,res,next)=>{
 
        let data=await User.find();
        if(!User){
            next(new ExpressError(404,"No User found"));
      
        res.send("---user---");
    }
    
}))


app.use((err,req,res,next)=>{
    let {statusCode=500,message="Default error"}=err;
    res.status(statusCode).send(message);
})