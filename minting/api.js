const express = require("express")
const { db } = require("./firebase")

const app = express()

app.get("/nft/:id", async (req, res) => {
  const doc = await db.collection("drug_nfts").doc(req.params.id).get()

  if (!doc.exists) {
    return res.status(404).json({ error: "NFT not found" })
  }

  res.json(doc.data())
})

app.listen(3000, () =>
  console.log("API running at http://localhost:3000")
)
