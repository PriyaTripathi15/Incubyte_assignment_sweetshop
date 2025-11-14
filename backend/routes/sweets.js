const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Protected sweets routes
router.use(auth);

// POST /api/sweets - add new sweet
router.post('/', sweetController.createSweet);

// GET /api/sweets - list all sweets
router.get('/', sweetController.listSweets);

// GET /api/sweets/search - search
router.get('/search', sweetController.searchSweets);

// PUT /api/sweets/:id - update a sweet
router.put('/:id', sweetController.updateSweet);

// DELETE /api/sweets/:id - delete (admin only)
router.delete('/:id', admin, sweetController.deleteSweet);

// POST /api/sweets/:id/purchase - purchase (decrease quantity)
router.post('/:id/purchase', sweetController.purchaseSweet);

// POST /api/sweets/:id/restock - restock (admin only)
router.post('/:id/restock', admin, sweetController.restockSweet);

module.exports = router;
