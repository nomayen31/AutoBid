const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access — No token found" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).send({ message: "Unauthorized access — Invalid token" });
    }

    req.user = decoded; // Store decoded user info
    next();
  });
};

// ✅ MongoDB setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8k7klrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // ✅ JWT issue route
    app.post("/jwt", async (req, res) => {
      try {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "3d",
        });

        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
          })
          .send({ success: true });
      } catch (error) {
        console.error("JWT Error:", error);
        res.status(500).send({ success: false, message: "Failed to create token" });
      }
    });

    // ✅ Logout route (clear cookie)
    app.post("/logout", async (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .send({ success: true });
    });

    // ✅ Get all cars
    app.get("/cars", async (req, res) => {
      const result = await allCollection.find().toArray();
      res.send(result);
    });

    // ✅ Get single car (Protected)
    app.get("/car/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCollection.findOne(query);
      res.send(result);
    });

    // ✅ Add new car (Protected)
    app.post("/car", verifyToken, async (req, res) => {
      const carData = req.body;
      const result = await allCollection.insertOne(carData);
      res.send(result);
    });

    // ✅ Place a bid (Protected)
    app.post("/bid", verifyToken, async (req, res) => {
      const bidData = req.body;
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    });

    // ✅ Get cars by user email (Protected)
    app.get("/cars/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { "buyer.email": email };
      const result = await allCollection.find(query).toArray();
      res.send(result);
    });

    // ✅ Delete a car (Protected)
    app.delete("/car/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCollection.deleteOne(query);
      res.send(result);
    });

    // ✅ Update car details (Protected)
    app.put("/car/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const updatedCar = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedCar };
      const result = await allCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // ✅ Get user's own bids (Protected)
    app.get("/my-bids/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      try {
        const query = { bidder_email: email };
        const result = await bidsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch bids" });
      }
    });

    // ✅ Get bid requests for seller (Protected)
    app.get("/my-request/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      try {
        const query = { seller_email: email };
        const result = await bidsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch bid requests" });
      }
    });

    // ✅ Update bid status (Protected)
    app.patch("/bid/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { status } };
      const result = await bidsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connection established successfully!");
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
}
run().catch(console.dir);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚗 Welcome to AutoBid API — Secure JWT Server Running.");
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
