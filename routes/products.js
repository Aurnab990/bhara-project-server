const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const productsCollection = client.db('treehouse').collection('products');

  router.get('/', async (req, res) => {
    const filter = {};
    if (req.query.name) filter.productName = { $regex: req.query.name, $options: 'i' };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice) filter.price = { $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
    
    const products = await productsCollection.find(filter).toArray();
    res.status(200).json(products);
  });

  router.post('/', async (req, res) => {
    const result = await productsCollection.insertOne(req.body);
    res.send(result);
  });

  router.get('/:id', async (req, res) => {
    const product = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.send(product);
  });

  router.delete('/:id', async (req, res) => {
    const result = await productsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  });

  return router;
};
