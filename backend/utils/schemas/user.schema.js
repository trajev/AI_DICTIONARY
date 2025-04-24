const Joi = require("joi");

const userSchema = Joi.object({

  username: Joi.string().alphanum().min(4).max(30).required()
    .messages({
      "string.base": `"username" should be a type of 'text'`,
      "string.empty": `"username" cannot be an empty field`,
      "string.min": `"username" should have a minimum length of {#limit}`,
      "any.required": `"username" is a required field`,
    }),

  password: Joi.string().min(6).required()
    .messages({
      "string.empty": `"password" cannot be an empty field`,
      "any.required": `"password" is a required field`,
      "string.min": `"password" should have a minimum length of {#limit}`,
    }),

})


module.exports = { userSchema };