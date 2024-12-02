const express = require('express');
const Order = require('../models/order');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await Order.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/provider/:email', async (req, res) => {
  try {
    const orders = await Order.find({ providerEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ orderEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const result = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
