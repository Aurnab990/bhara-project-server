const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const usersCollection = client.db('treehouse').collection('users');

  router.get('/', async (req, res) => {
    const { email } = req.query;
    if (email) {
      const user = await usersCollection.findOne({ email });
      return user ? res.json(user) : res.status(404).json({ message: 'User not found' });
    }
    const users = await usersCollection.find().toArray();
    res.send(users);
  });

  router.post('/', async (req, res) => {
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
  });

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateUser },
      { upsert: true }
    );
    res.send(result);
  });

  return router;
};
