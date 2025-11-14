const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../utils/validators');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

exports.register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = new User(value);
  await user.save();

  const token = generateToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

exports.login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await user.comparePassword(value.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};
