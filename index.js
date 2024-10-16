const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER);

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

    //GET ALL USERS API
    // GET ALL USERS API
    app.get('/users', async (req, res) => {
      const { email } = req.query;  // Extract the 'email' query parameter from the request

      if (email) {
        // Find the user with the specific email
        const query = { email: email };  // MongoDB query to match the email
        const user = await usersCollection.findOne(query);  // Use usersCollection to find the user

        if (user) {
          res.json(user);  // Send the user data if found
        } else {
          res.status(404).json({ message: 'User not found' });  // Handle user not found
        }
      } else {
        // Fallback: If no email query parameter is provided, return all users
        const cursor = usersCollection.find();
        const users = await cursor.toArray();
        res.send(users);  // Return all users
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
      // console.log(updatedDoc);
      const result = await usersCollection.updateOne(query, updatedDoc, options);

      res.send(result);

    })

    //GET PRODUCT API 

    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const product = await cursor.toArray();
      res.send(product)
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
    app.delete('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })




    // app.delete('/products/:id', async (req, res) => {
    //   const id = (req.params.id);
    //   const query = { _id: new ObjectId(id) };
    //   const result = await productsCollection.deleteOne(query);
    //   res.send(result);
    // });
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