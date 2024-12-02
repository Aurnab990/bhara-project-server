const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.name) filter.productName = { $regex: req.query.name, $options: 'i' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await Product.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
