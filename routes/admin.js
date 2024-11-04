const express =require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const Recipe = require("../models/recipe");
const Review = require("../models/review");
const Report = require("../models/report");
const {isUserLoggedIn} = require("../middleware");
const wrapAsync = require("../utils/wrapAync");
const ExpressError = require("../ExpressError");


// dashboard

router.get("/dashboard",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let recipes= await Recipe.find();
    let users = await User.find();
    let reviews = await Review.find();
    let totalRecipes =recipes.length;
    let totalUsers =users.length;
    let totalReviews =reviews.length;

    res.render("./admin/adminDashboard.ejs",{totalRecipes, totalUsers, totalReviews});
    
}))

// view users

router.get("/users",isUserLoggedIn,wrapAsync(async(req,res)=>{   
    let users = await User.find();
    let recipes= await Recipe.find();
    let index = 0;
    res.render("./admin/viewUsers.ejs",{users, index});
}))


// view recipes
router.get("/recipes",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let recipes= await Recipe.find().populate('owner');
    res.render("./admin/viewRecipes.ejs",{recipes});
}))


// view reports

router.get("/reports",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let reports= await Report.find().populate({path : 'reported_recipe',populate:{path : 'owner'}}).populate('reported_user');
    res.render("./admin/viewReports.ejs",{reports});
}));


//admin logout

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/login");
    })
}) 

//deleting user by admin

router.get("/delete/user/:id",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let user = await User.findById(id);

    if(user.email === process.env.ADMIN_EMAIL){
        req.flash("error_msg", "You cannot delete yourself");
        return res.redirect("/admin/users");
    }
    
    let dltUser= await User.findByIdAndDelete(id);

    await Recipe.deleteMany({ "owner": id });
    await Review.deleteMany({ "author": id });

    req.flash("success_msg", "User is permanantly deleted");
    res.redirect("/admin/users");
}));


//removing reported recipe from reports

router.get("/remove/reportRecipe/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let recipe = await Report.findOneAndDelete(id);

    req.flash("success_msg","Recipe removed from reports");
    res.redirect("/admin/reports")
}));


//deleting recipe from reports and recipe schema by admin [--from reports page--]

router.get("/reportRecipe/:reportedRecipeId/:recipeId/:userId/:reportedUserId",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let {reportedRecipeId, recipeId , userId, reportedUserId} = req.params;
    
    let recipe = await Recipe.findById(recipeId);
    let recipeOwner = await User.findById(userId);
    let reportedUser = await User.findById(reportedUserId);

    let reportedRecipe = await Report.findOneAndDelete(reportedRecipeId);
    let deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
        req.flash("error_msg", "Recipe not found");
        return res.redirect("/admin/recipes");
    }


    if(!reportedUser){
        return new ExpressError(404,"Reported User not found");
    }

    let msgToReporter = `Dear ${reportedUser.fullname},

               Thank you for your vigilance and for helping us maintain the quality of our recipe platform.
               We wanted to inform you that the recipe you reported has been reviewed and subsequently deleted
               from our system.

               If you have any further concerns or notice any other recipes that may require attention,
               please do not hesitate to reach out.

               Thank you for your continued support!

               Best regards,
               The Recipe Team`;

    let msgToRecipeOwner = `Dear ${recipeOwner.fullname},

                            We wanted to inform you that your recipe titled '${recipe.title}' has been deleted from our platform.
                            This action was taken because the recipe was reported for review, and it did not meet our community standards. 

                            If you believe this was a mistake or have any questions regarding this decision,
                            please feel free to reach out to our support team.

                            Thank you for your understanding.

                            Best regards,
                            The Recipe Team`

    reportedUser.adminMsg.push(msgToReporter);
    recipeOwner.adminMsg.push(msgToRecipeOwner);
    await reportedUser.save();
    await recipeOwner.save();

    if(recipeOwner){
        recipeOwner.totalRecipes -=1;
        await recipeOwner.save();
    }

    req.flash("success_msg", "Recipe Deleted");
    res.redirect("/admin/recipes");
}));


// deleting from recipes

router.get("/delete/recipe/:recipeId/:recipeOwnerId", isUserLoggedIn, wrapAsync(async (req, res) => {
    const { recipeId, recipeOwnerId } = req.params;

    const reportRecipe = await Report.find({ "reported_recipe": recipeId });
    
    if (reportRecipe.length > 0) {
        await Report.deleteMany({ "reported_recipe": recipeId });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        req.flash("error_msg", "Recipe not found");
        return res.redirect("/admin/recipes");
    }

    const owner = await User.findById(recipeOwnerId);
    if (!owner) {
        req.flash("error_msg", "Recipe owner not found");
        return res.redirect("/admin/dashboard");
    }

    await Recipe.findByIdAndDelete(recipeId);

    const msgToRecipeOwner = `Dear ${owner.fullname},

    We wanted to inform you that your recipe titled '${recipe.title}' has been deleted from our platform.
    This action was taken because the recipe was reported for review, and it did not meet our community standards. 

    If you believe this was a mistake or have any questions regarding this decision,
    please feel free to reach out to our support team.

    Thank you for your understanding.

    Best regards,
    The Recipe Team`;

    owner.totalRecipes -= 1;
    owner.adminMsg.push(msgToRecipeOwner);
    await owner.save();

    req.flash("success_msg", "Recipe Deleted");
    res.redirect("/admin/recipes");
}));


//warning user

router.get("/warn/:id",isUserLoggedIn,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let user = await User.findById(id);

    if(user.email === process.env.ADMIN_EMAIL){
        req.flash("error_msg", "You can't warn yourself");
        return res.redirect("/admin/users");
    }
    

    if (!user) {
        req.flash("error_msg", "User not found");
        return res.redirect("/admin/dashboard");
    }

    let msg = `Dear ${ user.fullname },
    
               the content associated with your account has been flagged for potentially violating our
                content policies. Please make necessary changes to avoid future consequences.
               
               Thank you for your understanding.

               Best regards,
               The Recipe Team`

               
    user.adminMsg.push(msg);

    await user.save();
    req.flash("success_msg" , "Warning sent successfully");
    res.redirect("/admin/dashboard");
}));


// user reporting recipe

router.post("/:recipeId/:userId", isUserLoggedIn,wrapAsync(async(req,res)=>{
    let {recipeId, userId} = req.params;
    let reason = req.body.reason;
    let desc = req.body.description;
    let recipe = await Recipe.findById(recipeId);
    let report = await User.findById(userId);

    if (!reason || !desc) {
        req.flash("error_msg", "Please provide a reason and description for the report.");
        return res.redirect(`/recipes/show/${recipeId}`);
    }

    let addReport = new Report({
        reason : reason,
        description : desc,
    })

    addReport.reported_recipe = recipe;

    addReport.reported_user = report;

    await addReport.save();
    
    req.flash("success_msg","Report submitted successfully");
    res.redirect(`/recipes/show/${recipeId}`);

}))



module.exports =router;