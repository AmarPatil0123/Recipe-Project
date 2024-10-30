const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Recipe = require("../models/recipe")
const Review = require("../models/review")

const UserSchema = new Schema({
    email: { type: String, required: true,lowercase :true,unique: true },
    username :{type:String,required:true},
    fullname:{type:String,required:true},
    profile_image: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/dhxnjdtsq/image/upload/v1728583182/userImages/eazvihapnjvxnyp76mdi.jpg",
        },
        filename: {
            type: String,
            default: "userImages/eazvihapnjvxnyp76mdi"
        }
    },
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    totalRecipes:{
        type:Number,
        default:0,
    },
    totalReviews:{
        type:Number,
        default:0,
    },
    likedRecipe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe' 
    }],
    dislikedRecipe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe' 
    }],
    bio: String,

    facebook: String,

    instagram: String,

    twitter: String,

    adminMsg : [{
        type : String,
    }],

    role: { type: String, enum: ['user', 'admin'],default: 'user' },
    
    created_at: { type: Date, default: Date.now }
});


UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);
