const mongoose=require("mongoose");
const Recipe=require("../models/recipe.js");
const initData=require("./data.js");

main().then(()=>console.log("Connected Successfully")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/recipes');
}

async function dataInit() {
    await Recipe.deleteMany({});
    await Recipe.insertMany(initData.data);
}

dataInit();
