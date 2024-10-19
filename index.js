const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nhkvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const usersCollection = client.db('treehouse').collection('users');
    const productsCollection = client.db('treehouse').collection('products');
    const ordersCollection = client.db('treehouse').collection('orders');

    //GET ALL USERS API
    app.get('/users', async (req, res) => {
      const { email } = req.query;

      if (email) {
        const query = { email: email };
        const user = await usersCollection.findOne(query);

        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } else {
        const cursor = usersCollection.find();
        const users = await cursor.toArray();
        res.send(users);
      }
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          phone: updateUser.phone,
          title: updateUser.title,
          thana: updateUser.thana,
          zila: updateUser.zila,
          district: updateUser.district
        }
      };

      const result = await usersCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    //GET PRODUCT API 
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    //ORDERS API LISTING
    app.post('/orders', async (req, res) => {
      const order = req.body;
      if (!order) {
        return res.status(400).send({ error: 'Order data is missing!' });
      }
      try {
        const result = await ordersCollection.insertOne(order);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to place the order' });
      }
    });

    app.get('/orders', async (req, res) => {
      const query = {};
      const cursor = ordersCollection.find(query);
      const order = await cursor.toArray();
      res.send(order);
    });

    // Get orders for a specific provider by email
    app.get('/orders/provider/:email', async (req, res) => {
      const providerEmail = req.params.email;
      try {
        const orders = await ordersCollection.find({ providerEmail }).toArray();
        res.send(orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).send({ message: 'Error fetching orders' });
      }
    });

    // Get orders for a specific user by orderEmail
    app.get('/orders/user/:email', async (req, res) => {
      const orderEmail = req.params.email; // Get the email from the request parameters
      try {
        const orders = await ordersCollection.find({ orderEmail }).toArray();
        if (orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this email.' });
        }
        res.status(200).json(orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).send({ message: 'Error fetching orders' });
      }
    });

    // Accept an order
    // Update order status API
    app.patch('/orders/:id', async (req, res) => {
      const orderId = req.params.id;
      const { status } = req.body; // Expect status to be passed in the body

      // Check if the status is either 'accepted' or 'declined'
      if (status !== 'accepted' && status !== 'declined') {
        return res.status(400).send({ message: 'Invalid status. Status must be either "accepted" or "declined".' });
      }

      try {
        const filter = { _id: new ObjectId(orderId) }; // Find order by ID
        const update = { 
          $set: {
             status: status,
             acceptedAt: new Date(), 
            },
          
         }; // Update the status

        const result = await ordersCollection.updateOne(filter, update); // Perform the update

        if (result.modifiedCount === 1) {
          res.status(200).send({ message: `Order ${status} successfully` });
        } else {
          res.status(404).send({ message: 'Order not found or status already updated' });
        }
      } catch (error) {
        res.status(500).send({ message: 'Failed to update order', error });
      }
    });


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
