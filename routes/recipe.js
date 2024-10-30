const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAync.js");
const ExpressError=require("../utils/ExpressError.js");
const Recipe = require("../models/recipe.js");
const User = require("../models/user.js");
const multer  = require('multer');
const { joiSchema} = require('../Joi_Validation.js');
const mongoose = require("mongoose");
const{ isUserLoggedIn}=require("../middleware.js");
const path=require("path");
const {storage}=require("../CloudConfig.js");
const upload = multer({ storage});
const {validateRecipe} =require("../middleware.js");



// root route, showing trending and reconmendded recipes

router.get("/", async (req, res,next) => {
    let recipes =await Recipe.aggregate([
        {$sort : {views : -1, likes :-1}},
        {$limit : 12}
    ])

    if(req.user) {
        const userId = req.user._id;
    
        const user = await User.findById(userId).select('following likedRecipe');
    
        if (!user) {
            req.flash("error_msg", "Something went wrong");
            return res.redirect("/recipes");
        }
    
        const followedUserRecipes = await Recipe.find({ owner: { $in: user.following } })
            .sort({ publishDate: -1, views: -1, likes: -1 })
            .lean();
    
        const likedRecipes = await Recipe.find({ _id: { $in: user.likedRecipe } })
            .sort({ publishDate: -1, views: -1, likes: -1 })
            .lean();
    
        const allRecipes = [...followedUserRecipes, ...likedRecipes];
        const uniqueRecipes = Array.from(
            new Map(allRecipes.map(recipe => [recipe._id.toString(), recipe])).values()
        );
    
        const recommendedRecipes = uniqueRecipes.sort((a, b) => {
            return (
                new Date(b.publishDate) - new Date(a.publishDate) || 
                b.views - a.views || 
                b.likes - a.likes
            );
        }).slice(0, 12); 
    
        return res.render("./recipes/home.ejs", { recipes, recommendedRecipes });
    }
    
    res.render("./recipes/home.ejs", { recipes});
    
});


//new Recipe

router.get("/new",isUserLoggedIn,(req, res) => {
    res.render("./recipes/new.ejs");
});


router.post("/newData", upload.single('recipe[image]'), isUserLoggedIn, validateRecipe, wrapAsync(async (req, res, next) => {

    let newRecipe = new Recipe(req.body.recipe);
    newRecipe.owner = req.user._id;

    let recipeOwner = await User.findById(req.user._id);

    recipeOwner.totalRecipes += 1;
    newRecipe.image = {
        url: req.file.path,
        filename: req.file.filename,
    };

    await recipeOwner.save();

    await newRecipe.save();
    
    req.flash('success_msg', 'New Recipe created successfully');
    res.redirect("/recipes");
}));


//navbar  --  search recipe

router.post("/search",wrapAsync(async(req,res)=>{
    let recipeName = req.body.recipe ;
    let recipes = await Recipe.find({"title" : recipeName})
    .sort({views: -1, likes: -1,  publishDate: -1 })
    .lean();

    if(recipes.length === 0){
        return res.redirect(`/recipes/${recipeName}`);
    }
    let category = recipes[0].category;
    res.render("./recipes/categories.ejs",{recipes , category})
}));


//show route

router.get("/show/:id", wrapAsync(async (req, res, next) => {

    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error_msg", "Invalid Id")
        return res.redirect(`/recipes/show/${id}`)
    }

    let recipe = await Recipe.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');

    let otherRecipes = await Recipe.find({owner : recipe.owner._id})
    .sort({ views: -1, likes: -1,  publishDate: -1 })
    .lean();

    let recipes = otherRecipes.filter((otherRecipe) => !otherRecipe._id.equals(recipe._id)).slice(0, 5);;

    if (recipe && recipe.owner === null) {
        req.flash("error_msg","Recipe not found");
        return res.redirect("/recipes");
    }
    res.render("./recipes/show.ejs", { recipe , recipes});
}));


// fetch request to increment page views

router.get("/pageCount/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let recipe = await Recipe.findById(id);
    
    if(recipe){
        recipe.views +=1;
        await recipe.save();

    }
 
}));

//edit route

router.get("/:id/edit", isUserLoggedIn,wrapAsync(async (req, res,next) => {
    let id = req.params.id;
    let recipe = await Recipe.findById(id);

    if (recipe && recipe.owner === null) {
        req.flash("error_msg","Recipe not found");
        return res.redirect("/recipes");
    }
    
    res.render("./recipes/edit.ejs", { recipe });
}));


router.put("/:id/editData", isUserLoggedIn, upload.single('recipe[image]'), validateRecipe, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let recipe = req.body.recipe;

    if (!recipe) {
        req.flash("error_msg","Something went wrong");
        return res.redirect(`/recipes/${id}/edit`);
    }

    let upddata = await Recipe.findByIdAndUpdate(id, { ...recipe }, { new: true });

    if (!upddata) {
        req.flash("error_msg", "Recipe not found");
        return res.redirect("/recipes"); 
    }

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        upddata.image = {
            url: url,
            filename: filename,
        };
        await upddata.save();
    }

    req.flash("success_msg", "Recipe updated successfully");
    res.redirect(`/recipes/show/${id}`);
}));


//delete  recipe

router.delete("/:id/delete", isUserLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let user = await User.findById(req.user._id);

    if (!user) {
        req.flash("error_msg", "User not found");
        return res.redirect("/recipes"); 
    }

    if (user.totalRecipes > 0) {
        user.totalRecipes -= 1;
    }

    await user.save();
    let recipe = await Recipe.findOneAndDelete({ _id: id }); 
    req.flash("success_msg","Recipe Deleted");

    res.redirect("/recipes");

}));



//categories 

router.get("/:category",wrapAsync(async(req,res)=>{
    let category=req.params.category;
    let recipes=await Recipe.find({"category":category})
    .sort({views: -1, likes: -1,  publishDate: -1 })
    .lean();

    res.render("./recipes/categories.ejs",{recipes,category});
}));



module.exports=router;