// simulateMint.js
console.log("Script started");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") })
const { mintDrugNFT } = require("../minting/mintNFT")

async function run() {
  const result = await mintDrugNFT({
    manufacturer: "Pfizer",
    manufacturingDate: "2026-01-01",
    expiryDate: "2027-01-01",
    chipPublicKey: "04A9F3C8D1E2B7A9F4D3C2B1E0F9A8D7",
    batchId: "BATCH-TEST-001",
    drugName: "mRNA Vaccine",
    description: "Simulated mint using Firebase"
  })

  console.log("NFT minted:", result)
}

run()
