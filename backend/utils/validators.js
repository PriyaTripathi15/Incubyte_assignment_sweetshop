const Joi = require('joi');

// --------------------------
// User Registration Schema
// --------------------------
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),

  // ADD THIS ↓↓↓
  role: Joi.string().valid('admin', 'user').default('user')
});

// --------------------------
// Login Schema
// --------------------------
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// --------------------------
// Sweet Create Schema
// --------------------------
const sweetCreateSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().precision(2).min(0).required(),
  quantity: Joi.number().integer().min(0).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  sweetCreateSchema
};
