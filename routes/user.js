const express = require('express');
const multer = require('multer');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAync");
const passport = require("passport");
const { saveRedirectUrl, isUserLoggedIn } = require('../middleware');
const path = require('path');
const { storage } = require("../UserCloud");
const upload = multer({ storage });
const Recipe = require("../models/recipe");
const Review = require("../models/review");
const ExpressError = require('../ExpressError');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const user = require('../models/user');


//signup

router.get("/signup", (req, res) => {

    res.render("./users/signup.ejs");

});

router.post('/signup', upload.single('profile_image'), wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password, fullname } = req.body;

        let user=await User.find({email : email});

        // if(user){
        //     req.flash("error_msg", "email already exists");
        //     return res.redirect("/signUp");
        // }

        let getUser = new User({ email, username, fullname });

        if (req.file) {
            getUser.profile_image = {
                url: req.file.path,
                filename: req.file.filename
            };
        } else {

            getUser.profile_image = {
                url: "https://res.cloudinary.com/dhxnjdtsq/image/upload/v1728583182/userImages/eazvihapnjvxnyp76mdi.jpg",
                filename: "userImages/eazvihapnjvxnyp76mdi",
            };
        }

        let newUser = await User.register(getUser, password);

        req.login(newUser, (err) => {
            if (err) {
                
                return next(err);
            }
            req.flash("success_msg", "Welcome to Recipes");
            res.redirect("/recipes");
        });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", err.message);
        res.redirect("/signUp");
    }
}));


//login

router.get("/login",(req, res) => {
    res.render("./users/login.ejs");
});


// checking user and admin login

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync((async (req, res) => {

        let email =req.body.email;

        let admin=await User.findOne({email : email});
        if( admin.email=== process.env.ADMIN_EMAIL){
            req.flash("success_msg", "Login Successfull");
            return res.redirect("/admin/dashboard");
        }
       
        let url = res.locals.redirectUrl || "/recipes";

        req.flash("success_msg", "Login Successfull");

        res.redirect(url);
           
})));

//user logout

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success_msg", "Lougout Successfully");
        res.redirect("/recipes");
    })
}) 


//favourates

router.post("/favourateRecipes",wrapAsync((req, res) => {

    const { arr } = req.body;
    if(!req.body){
        return new ExpressError(401,"Something went wrong");
    }

    req.session.favourites = arr; 

}));



router.get("/favourite", wrapAsync(async (req, res) => {

    let favoriteIds = req.session.favourites || [];

    favoriteIds = favoriteIds.filter(id => id !== 'tinymce-custom-colors-forecolor' && id !== 'tinymce-custom-colors-hilitecolor');
    
    let recipes = [];
   
        for (const id of favoriteIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {

               req.flash("error_msg", "Invalid Recipe Id");
               return res.redirect("/recipes");
            }
            const recipe = await Recipe.findById(id);
            if (recipe) {
                recipes.push(recipe);
            }  
        }
    
    res.render("./users/favourite.ejs", { recipes });
}));


router.get("/forgot-password", (req, res) => {
    res.render("./users/forget-password.ejs");
});


//sending token

router.post("/forgotPassEmail", async (req, res) => {
    try {
        let email = req.body.email;

        let user = await User.findOne({ email });

        let userId =user._id;

        if (!user) {
            req.flash("error_msg", "Invalid email address");
            return res.redirect("/login");
        }

        let token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Call the main function to send the email
        await main(email, userId, token, transporter);
        res.status(200).json({ message: "Link has been sent to your registered email id." });

    } catch (error) {
        console.error(error);
        req.flash("error_msg", "An error occurred while sending the email."); 
        res.redirect("/login");
    }
});


async function main(email, userId, token, transporter) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL, 
        to: email, 
        subject: "Reset Password ✔", 
        text: `You are receiving this because you requested a password reset.\n\n
               Please click on the following link to reset your password:\n
               https://yammyrecipes.onrender.com/reset-password/${userId}/${token}\n\n
               If you did not request this, please ignore this email.\n`
    });

    console.log("Message sent: %s", info.messageId);
}


// rendering new password page

router.get("/reset-password/:userId/:tokenId", async (req, res) => {
    try {
        let { userId, tokenId } = req.params;

        let user = await User.findById(userId);

        if (!user) {
            req.flash("error_msg", "Invalid user ID");
            return res.redirect("/login");
        }

        jwt.verify(tokenId, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                req.flash("error_msg", "Invalid token or token has expired");
                return res.redirect("/login");
            }
            res.render("./users/newPassword.ejs", { userId }); 
            
        });
        
    } catch (error) {
        console.error(error);
        req.flash("error_msg", "An error occurred while resetting the password."); 
        res.redirect("/login");
    }
});

router.post("/newPassword/:userId",async(req,res)=>{
    try{
        let {userId} = req.params;
        let user = await User.findById(userId);

        if(!user){
            req.flash("error_msg", "User not found");
            return res.redirect("/login");
        }
        let newPassword = req.body.newPass;
        let confirmPassword = req.body.confirmPass;

        if(newPassword !== confirmPassword){
            req.flash("error_msg", "Both password must be same");
            return res.render("./users/newPassword.ejs", { userId }); 
        }

        user.setPassword(newPassword, async (err) => {
            if (err) {
                req.flash("error_msg", "An error occurred while setting your password.");
                return res.redirect("/login");
            }

            await user.save();

            req.flash("success_msg", "Password reseted successfully.");
            res.redirect("/login");
        });

    } catch (error) {
        console.error(error);
        req.flash("error_msg", "An error occurred while resetting your password.");
        res.redirect("/login");
    }
    
})

// Messages from Admin to user

router.get("/adminMsg/:id",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let user = await User.findById(id);

    res.render("./users/adminMsg.ejs",{user});

}));


//edit profile

router.put("/updateProfile/:id", isUserLoggedIn, upload.single('user[profile_image]'), wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = req.body.user;

    let user = await User.findByIdAndUpdate(id, data, { new: true });
    if (req.file) {
        user.profile_image = {
            url: req.file.path,
            filename: req.file.filename
        }
    }

    await user.save();
    res.redirect(`/profile/${id}`);
}))



router.get("/editprofile/:id", isUserLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let userData = await User.findById(id);
    if (!userData) {
        req.flash("error_msg", "User Not found");
        return res.redirect(`/profile/${id}`);
    }
    res.render("./users/editProfile.ejs", { userData });
}))


// profile

router.get("/profile/:id", isUserLoggedIn, wrapAsync(async (req, res, next) => {
    try {
        let { id } = req.params;

        let userData = await User.findById(id);

        if (!userData) {
            return new ExpressError(400, "User Not found");
        }

        let recipes = await Recipe.find({ owner: id })
        .sort({views: -1, likes: -1,  publishDate: -1 })
        .lean();

        req.session.item = "bag";
        res.render("./users/profile.ejs", { userData, recipes });

    } catch (error) {
        next(error);
    }
}));


//delete user

router.get("/deleteAcc/:id",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let dltUser = await User.findByIdAndDelete(id);

    if (!dltUser) {
        req.flash("error_msg", "User not found");
        return res.redirect("/recipes");
    }

    let recipe =await Recipe.deleteMany({ "owner": id });
    let review =await Review.deleteMany({"author" : id});

    console.log("user :",dltUser);
    console.log("recipe :",recipe);
    console.log("reviews :",review);


    req.flash("success_msg", "Account Deleted Sucessfully");
    res.redirect("/recipes");
}));



// Follow Route
router.get("/follow/:id", isUserLoggedIn, async (req, res) => {
    try {
        let { id } = req.params;
        let user = req.user;
        let followedUser = await User.findById(id);
        if (!followedUser) {
            req.flash("error_msg", "User not found");
            return res.status(404).json({ message: "User not found" });
        }
        
        user.following.push(followedUser._id)
        followedUser.followers.push(user._id);
        await followedUser.save();
        await  user.save();

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


// Unfollow Route
router.get("/unfollow/:id", isUserLoggedIn, async (req, res) => {
    try {
        let { id } = req.params;
        let user = req.user;
        let unfollowedUser = await User.findById(id);
        if (!unfollowedUser) {
            req.flash("error_msg", "User not found");
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndUpdate(id, { $pull: { followers: user._id } });

        await User.findByIdAndUpdate(user._id,{$pull: { following: unfollowedUser._id }})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


// like route

router.get("/like/:recipeId/:userId", async (req, res) => {
    let { recipeId, userId } = req.params;

    let recipe = await Recipe.findById(recipeId);
    let user = await User.findById(userId);


    if (user.dislikedRecipe.includes(recipeId)) {
        if(recipe.dislikes>0){
            recipe.dislikes -=1;
        }
        await User.findByIdAndUpdate(userId, { $pull: { dislikedRecipe: recipeId } });
    }
    
    if (!user.likedRecipe.includes(recipeId)) {
        recipe.likes +=1;
        user.likedRecipe.push(recipeId);
    }

    await recipe.save();
    await user.save();

    res.status(200).json({ message: "Recipe is liked" });
});


//dislike route

router.get("/dislike/:recipeId/:userId",async(req,res)=>{
    let {recipeId , userId}= req.params;

    let recipe = await Recipe.findById(recipeId);
    let user = await User.findById(userId);


    if (user.likedRecipe.includes(recipeId)) {
        if (recipe.likes > 0){
             recipe.likes -= 1;
        }

        await User.findByIdAndUpdate(userId, { $pull: { likedRecipe: recipeId } });
    }
    
    if (!user.dislikedRecipe.includes(recipeId)) {
        recipe.dislikes +=1;
        user.dislikedRecipe.push(recipeId);
    }

    await recipe.save();
    await user.save();
    res.status(200).json({message : "Recipe has been disliked"});
});


module.exports = router;


