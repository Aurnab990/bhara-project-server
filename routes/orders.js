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
    const orders = await ordersCollection
      .find()
      .sort({ _id: -1 })
      .toArray();
    res.send(orders);
  });

  router.get('/provider/:email', async (req, res) => {
    const orders = await ordersCollection
      .find({ providerEmail: req.params.email })
      .sort({ _id: -1 })
      .toArray();
    res.send(orders);
  });

  router.get('/user/:email', async (req, res) => {
    const orders = await ordersCollection
      .find({ orderEmail: req.params.email })
      .sort({ _id: -1 })
      .toArray();
    res.send(orders);
  });

  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const update = { $set: { status, acceptedAt: new Date() } };
    const result = await ordersCollection.updateOne({ _id: new ObjectId(id) }, update);
    res.send(result);
  });

  // New route to update the transaction number
  router.patch('/transaction/:id', async (req, res) => {
    const { id } = req.params;
    const { transactionNumber } = req.body;

    try {
      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { transactionNumber } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ message: 'Transaction number updated successfully', result });
    } catch (err) {
      console.error('Error updating transaction number:', err);
      res.status(500).json({ error: 'Failed to update transaction number' });
    }
  });

  return router;
};
