const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:5173"], 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server Running on  ${port}`);
});
