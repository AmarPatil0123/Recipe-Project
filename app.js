const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const recipeRouter=require("./routes/recipe.js")
const reviewRouter=require("./routes/review.js");
const UserRouter=require("./routes/user.js");
const AdminRouter=require("./routes/admin.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { error } = require('console');


// Atlas DB Url
let dbUrl = process.env.ATLASDB_URL

const store =  MongoStore.create({
    mongoUrl :dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error",()=>{
    console.log("Error in MONGO_STORE",err);
})

let sessionOptions={
    store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() * 7 *24 *60 * 60 *1000,
        maxAge:7 *24 *60 * 60 *1000,
        httpOnly:true,
    }
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true, limit: '50mb' })); //used to parse form data
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.json({ limit: '50mb' })); // used to parse json[API] data like data through fetch
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user;
    next();
});


main().then(() => console.log("Connected to DB")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen("8080", () => {
    console.log("Server listening on port 8080");
});

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store'); 
    next();
});

app.use("/recipes",recipeRouter);
app.use("/recipes/:recipeId/reviews",reviewRouter);
app.use("/",UserRouter);
app.use("/admin", AdminRouter);



app.all("*", (req, res, next) => {
    if(req.path === "/"){
        return res.redirect("/recipes")
    }
    next(new ExpressError(404, "Page not found"));
});



//error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong", name } = err;

    if (name === "ValidationError") {
        status = 400;
        message = "Please enter valid data";
    } else if (name === "CastError") {
        status = 400;
        message = "Invalid ID format";
    }

    res.status(status).render("../Error.ejs", { message });
});

