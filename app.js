require('dotenv').config();
const express = require("express");
const { verify } = require("./verification/verify.service");
const app = express();

app.use(express.json());

app.post("/api/verify", async (req, res) => {
  const { chipId } = req.body;
  const result = await verify(chipId);
  res.json(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));
