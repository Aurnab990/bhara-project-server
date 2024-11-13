const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const ordersCollection = client.db('treehouse').collection('orders');

  router.post('/', async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  router.get('/', async (req, res) => {
    const orders = await ordersCollection.find().toArray();
    res.send(orders);
  });

  router.get('/provider/:email', async (req, res) => {
    const orders = await ordersCollection.find({ providerEmail: req.params.email }).toArray();
    res.send(orders);
  });

  router.get('/user/:email', async (req, res) => {
    const orders = await ordersCollection.find({ orderEmail: req.params.email }).toArray();
    res.send(orders);
  });

  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const update = { $set: { status, acceptedAt: new Date() } };
    const result = await ordersCollection.updateOne({ _id: new ObjectId(id) }, update);
    res.send(result);
  });

  return router;
};
