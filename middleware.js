const {joiSchema}=require("./Joi_Validation");
const ExpressError=require("./ExpressError");
const {validateReviews}=require("./Joi_Validation");

module.exports.isUserLoggedIn=(req,res,next)=>{

    if (!req.isAuthenticated()) {
        req.session.redirectURL=req.originalUrl;       
        req.flash('error_msg', 'Please log in to proceed further');
        return res.redirect('/login');       
    }
    next();
   
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectURL && req.session.redirectURL.substring(0, 7) !== "/admin/") {
        res.locals.redirectUrl = req.session.redirectURL;
    } else {
        res.locals.redirectUrl = "/recipes";
    }
    next();
}


module.exports.validateRecipe=(req,res,next)=>{
    let {error}=joiSchema.validate(req.body);

    if(error){
        errMsg=error.details[0].message
        return next(new ExpressError(401,errMsg));
    }
    next();
    
    
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=validateReviews.validate(req.body);

    if(error){
        errMsg=error.details[0].message;
        console.log(errMsg);
        return next(new ExpressError(401,errMsg));
    }
        
    next();
    
}