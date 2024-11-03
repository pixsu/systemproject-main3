const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    console.log('Fetched Products:', products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
