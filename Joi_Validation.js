const Joi = require('joi');

module.exports.joiSchema=Joi.object({
    recipe:Joi.object({
        title:Joi.string().min(2).max(20).required(),
        description: Joi.string().min(30).max(150).required(),
        image:Joi.string().allow("",null),
        ingredients:Joi.string().required(),
        steps:Joi.string().required(),
        category:Joi.string().required(),
    }).required()
})

module.exports.validateReviews=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().min(2).max(175).required(),
    }).required(),
})
