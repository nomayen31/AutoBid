const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8k7klrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const bidsCollection = client.db("autobid").collection("bids");
    const allCollection = client.db("autobid").collection("allcars");
    app.get("/cars", async (req, res) => {
      const result = await allCollection.find().toArray();
      res.send(result);
    });
    // get a single data
    app.get("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    // save bits

    app.post("/bid", async (req, res) => {
      const bidData = req.body;
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    });

    // save car

    app.post("/car", async (req, res) => {
      const carData = req.body;
      const result = await allCollection.insertOne(carData);
      res.send(result);
    });

    // get posted car
    app.get("/cars/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "buyer.email": email };
      const result = await allCollection.find(query).toArray();
      res.send(result);
    });
    // Delete  posted car
    app.delete("/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCollection.deleteOne(query);
      res.send(result);
    });

    // put
    app.put("/car/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCar = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedCar };

      const result = await allCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // get all bids for user by email form DB
    app.get("/my-bids/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await bidsCollection.find(query).toArray();
      res.send(result);
    });
    // get all bids for Car Owner  by email form DB
    app.get("/my-request/:email", async (req, res) => {
      const email = req.params.email;
      const query = { 'buyer.email':email };
      const result = await bidsCollection.find(query).toArray();
      res.send(result);
    });
    

    
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(
    "Welcome to AutoBid API — Powering the Future of Online Car Auctions."
  );
});

app.listen(port, () => {
  console.log(`Server Running on  ${port}`);
});
