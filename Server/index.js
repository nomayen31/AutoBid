// File: api/index.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1); // UNCHANGED

// CHANGED: tightened allowlist and added Firebase domain
const allowlist = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "https://agrotrade-a35fe.web.app",
  "https://agrotrade-a35fe.firebaseapp.com",
]);
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowlist.has(origin) || /\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));           // UNCHANGED
app.options(/.*/, cors(corsOptions)); // CHANGED: replace "*" with /.*/ to satisfy path-to-regexp in Express 5

app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "Unauthorized access — No token found" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized access — Invalid token" });
    req.user = decoded;
    next();
  });
};

// CHANGED: stable, cached client promise for Vercel serverless
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8k7klrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const mongoOpts = { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } };
if (!global._mongoClientPromise) { // ADDED
  const _client = new MongoClient(uri, mongoOpts);
  global._mongoClientPromise = _client.connect();
}
async function getDb() { // ADDED
  const client = await global._mongoClientPromise;
  return client.db("autobid");
}

app.post("/jwt", async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3d" });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,     // UNCHANGED
        sameSite: "none", // UNCHANGED
        path: "/",        // UNCHANGED
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .send({ success: true });
  } catch {
    res.status(500).send({ success: false, message: "Failed to create token" });
  }
});

app.post("/logout", async (req, res) => {
  res
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "none", path: "/" }) // UNCHANGED
    .send({ success: true });
});

app.get("/all-cars", async (req, res) => {
  const { filter, page = 0, size = 4, search, sort } = req.query;
  let query = {};
  if (filter) query.brand_name = filter;
  if (search) {
    query.$or = [
      { model_name: { $regex: search, $options: "i" } },
      { brand_name: { $regex: search, $options: "i" } },
      { category:  { $regex: search, $options: "i" } },
    ];
  }
  const sortOption =
    sort === "asc" ? { deadline: 1, dateline: 1 } :
    sort === "dsc" ? { deadline: -1, dateline: -1 } : {};
  const db = await getDb(); // ADDED
  const result = await db
    .collection("allcars")
    .find(query)
    .sort(sortOption)
    .skip(parseInt(page) * parseInt(size))
    .limit(parseInt(size))
    .toArray();
  res.send(result);
});

app.get("/cars-count", async (req, res) => {
  const { brand, search } = req.query;
  let query = {};
  if (brand) query.brand_name = brand;
  if (search) {
    query.$or = [
      { model_name: { $regex: search, $options: "i" } },
      { brand_name: { $regex: search, $options: "i" } },
      { category:  { $regex: search, $options: "i" } },
    ];
  }
  const db = await getDb(); // ADDED
  const count = await db.collection("allcars").countDocuments(query);
  res.send({ count });
});

app.get("/cars", async (_req, res) => {
  const db = await getDb(); // ADDED
  const result = await db.collection("allcars").find().toArray();
  res.send(result);
});

app.get("/car/:id", async (req, res) => {
  const id = req.params.id;
  const db = await getDb(); // ADDED
  const result = await db.collection("allcars").findOne({ _id: new ObjectId(id) });
  if (!result) return res.status(404).send({ message: "Car not found" });
  res.send(result);
});

app.post("/car", verifyToken, async (req, res) => {
  const carData = req.body;
  if (req.user?.email) carData.seller_email = req.user.email;
  const db = await getDb(); // ADDED
  const result = await db.collection("allcars").insertOne(carData);
  res.send(result);
});

app.get("/cars/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  if (req.user?.email !== email) return res.status(403).send({ message: "Forbidden access" });
  const db = await getDb(); // ADDED
  const query = { $or: [{ seller_email: email }, { "buyer.email": email }] };
  const result = await db.collection("allcars").find(query).toArray();
  res.send(result);
});

app.delete("/car/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const db = await getDb(); // ADDED
  const result = await db.collection("allcars").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return res.status(404).send({ message: "Car not found" });
  res.send(result);
});

app.put("/car/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const updatedCar = req.body;
  if (!updatedCar.gallery_images) delete updatedCar.gallery_images;
  const db = await getDb(); // ADDED
  const result = await db.collection("allcars").updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedCar }
  );
  if (result.matchedCount === 0) return res.status(404).send({ message: "Car not found" });
  res.send(result);
});

app.post("/bid", verifyToken, async (req, res) => {
  const bidData = req.body;
  if (!bidData.bidder_email && bidData.email) bidData.bidder_email = bidData.email;
  const db = await getDb(); // ADDED
  const result = await db.collection("bids").insertOne(bidData);
  res.send(result);
});

app.get("/my-bids/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const db = await getDb(); // ADDED
  const query = { $or: [{ bidder_email: email }, { email }] };
  const result = await db.collection("bids").find(query).toArray();
  res.send(result);
});

app.get("/my-request/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  const db = await getDb(); // ADDED
  const result = await db.collection("bids").find({ seller_email: email }).toArray();
  res.send(result);
});

app.patch("/bid/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const db = await getDb(); // ADDED
  const result = await db.collection("bids").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
  if (result.matchedCount === 0) return res.status(404).send({ message: "Bid not found" });
  res.send(result);
});

app.get("/", (_req, res) => {
  res.send("AutoBid API — Secure JWT Server Running.");
});

// UNCHANGED: 404 + centralized error handlers
app.use((req, res) => res.status(404).send({ message: "Route not found", path: req.originalUrl }));
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).send({ message: "Internal server error" });
});

// CHANGED: do not listen in Vercel; export handler for serverless runtime
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}
module.exports = app; // CHANGED: export Express app directly for Vercel handler
