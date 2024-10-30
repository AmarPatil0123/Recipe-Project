const express = require("express");
const router = express.Router({mergeParams:true});
const Recipe = require("../models/recipe.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAync.js");
const ExpressError=require("../ExpressError.js");
const { isUserLoggedIn } = require("../middleware.js");
const User = require("../models/user.js");
const {validateReview} =require("../middleware.js");




//REVIE SECTION

router.post("/", isUserLoggedIn, validateReview, wrapAsync(async (req, res, next) => {

    let { recipeId } = req.params;

    
    let recipe = await Recipe.findById(recipeId).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });

    let userHasReviewed = false;

    recipe.reviews.forEach(review => {
        if (review.author._id.equals(req.user._id)) {
            userHasReviewed = true;
        }
    });

    if (userHasReviewed) {
        req.flash("error_msg", "You already reviewed this recipe");
        return res.redirect(`/recipes/show/${recipeId}`);
    }


    if (req.body.review.rating === "0") {
        req.flash("error_msg", "Please select all the required fields");
        return res.redirect(`/recipes/show/${recipeId}`);
    }

    if(!req.body.review){
        throw new ExpressError(401,"Something went wrong");
    }
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; 

    const author = await User.findById(req.user._id);
    author.totalReviews += 1;
    await author.save();

    await newReview.save(); 

    recipe.reviews.push(newReview); 
    await recipe.save();

    req.flash("success_msg", "New review created");
    res.redirect(`/recipes/show/${recipeId}`);

}));


router.delete("/:reviewId", isUserLoggedIn,wrapAsync(async (req, res, next) => {
    const { recipeId, reviewId } = req.params;

    let review = await Review.findById(reviewId).populate('author');

    if(review.author.totalReviews > 0){
    review.author.totalReviews -=1;
    await review.author.save();
    }
    
    await Recipe.findByIdAndUpdate(recipeId, { $pull: { reviews: reviewId } });

    const result = await Review.findByIdAndDelete(reviewId);
    req.flash("success_msg","Review deleted");

    res.redirect(`/recipes/show/${recipeId}`); 
}));


module.exports=router;