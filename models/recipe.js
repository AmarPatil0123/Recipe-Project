const { string, ref } = require("joi");
const mongoose = require("mongoose");
const Review=require("../models/review");
const User=require("../models/user");


const RecipeSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
     },
    description: { 
        type: String,
        maxlength:[200,"Only 200 characters are allowed"], 
        required: true, 
    },
    ingredients: {
         type: String, 
         required: true 
    },
    steps: { 
        type: String, 
        required: true 
    },
    instructions:{
        type: String,
    },
    category: {
         type: String,
         required: true, 
    },
    image: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/dhxnjdtsq/image/upload/v1728583182/userImages/eazvihapnjvxnyp76mdi.jpg",
        },
        filename: {
            type: String,
            default: "userImages/eazvihapnjvxnyp76mdi"
        }
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",

    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likes:{
        type :Number,
        default :0,
    },
    dislikes:{
        type :Number,
        default :0,
    },
    views:{
        type :Number,
        default :0,
    },
    created_at: {
         type: Date, 
         default: Date.now,
    } 
});


RecipeSchema.post("findOneAndDelete",async(recipe)=>{
    if(recipe){
        await Review.deleteMany({_id:{$in:recipe.reviews}})

    }
})

module.exports = mongoose.model('Recipe', RecipeSchema);


