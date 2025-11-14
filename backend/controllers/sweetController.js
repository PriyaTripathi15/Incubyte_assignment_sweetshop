const Sweet = require('../models/Sweet');
const { sweetCreateSchema } = require('../utils/validators');
const mongoose = require('mongoose');

// Create a sweet
exports.createSweet = async (req, res) => {
  const { error, value } = sweetCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const exists = await Sweet.findOne({ name: value.name });
  if (exists) return res.status(400).json({ message: 'Sweet with this name already exists' });

  const sweet = new Sweet(value);
  await sweet.save();
  res.status(201).json(sweet);
};

// List all sweets (with optional pagination)
exports.listSweets = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const p = parseInt(page), l = parseInt(limit);
  const sweets = await Sweet.find().skip((p - 1) * l).limit(l).exec();
  res.json(sweets);
};

// Search sweets by name, category, or price range
// Query params: q=, category=, priceMin=, priceMax=
exports.searchSweets = async (req, res) => {
  const { q, category, priceMin, priceMax } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
  }
  const sweets = await Sweet.find(filter);
  res.json(sweets);
};

// Update sweet
exports.updateSweet = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });

  const payload = req.body;
  const sweet = await Sweet.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
  res.json(sweet);
};

// Delete sweet (admin only)
exports.deleteSweet = async (req, res) => {
  const { id } = req.params;
  const sweet = await Sweet.findByIdAndDelete(id);
  if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
  res.json({ message: 'Deleted' });
};

// Purchase sweet (decrease quantity) - protected (any authenticated user)
exports.purchaseSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity = 1 } = req.body;
  const qty = parseInt(quantity);
  if (qty <= 0) return res.status(400).json({ message: 'quantity must be >= 1' });

  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
  if (sweet.quantity < qty) return res.status(400).json({ message: 'Insufficient stock' });

  sweet.quantity -= qty;
  await sweet.save();
  res.json({ message: 'Purchase successful', sweet });
};

// Restock sweet (admin only)
exports.restockSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0) return res.status(400).json({ message: 'quantity must be > 0' });

  const sweet = await Sweet.findById(id);
  if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

  sweet.quantity += qty;
  await sweet.save();
  res.json({ message: 'Restocked', sweet });
};
