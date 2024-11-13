const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
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

    // Importing and passing the MongoDB client to each route module
    const usersRoutes = require('./routes/users')(client);
    const productsRoutes = require('./routes/products')(client);
    const ordersRoutes = require('./routes/orders')(client);

    app.use('/users', usersRoutes);
    app.use('/products', productsRoutes);
    app.use('/orders', ordersRoutes);

    app.get('/', (req, res) => {
      res.send("Server is running");
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);
