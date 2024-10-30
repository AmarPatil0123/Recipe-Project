const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User=require("../models/user");
const Recipe=require("../models/recipe");

let reportSchema = new Schema({
    reason : String,
    description : String,
    reported_recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', 
    },
    reported_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Report',reportSchema)