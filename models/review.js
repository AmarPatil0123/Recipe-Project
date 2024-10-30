const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User=require("../models/user");
const { ref } = require('joi');

const ReviewSchema = new Schema({
    rating: { type: Number, min: 1, max: 5, default :1,required: true }, 
    comment: { type: String, min:2,max:175,required: true },
    author :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
     
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', ReviewSchema);
