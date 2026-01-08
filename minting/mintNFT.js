require("dotenv").config({ path: require("path").join(__dirname, "../.env") })
const xrpl = require("xrpl")
const { db, admin } = require("../db/firebase.js")
const { getClient } = require("./xrplClient")

async function mintDrugNFT({
  manufacturer,
  manufacturingDate,
  expiryDate,
  chipPublicKey,
  batchId,
  drugName,
  description
}) {
  const client = await getClient()

  // Testnet wallet (use faucet-generated wallet)
  const seed = process.env.XRPL_SEED
  if (!seed) {
    throw new Error("XRPL_SEED environment variable is not set")
  }
  const wallet = xrpl.Wallet.fromSeed(seed) // get from .env, what is env? env is environment variable file that stores sensitive info like API keys, secrets, etc.

  const metadata = {
    manufacturer,
    manufacturing_date: manufacturingDate,
    expiry_date: expiryDate,
    chip_public_key: chipPublicKey,
    batch_id: batchId,
    drug_name: drugName,
    description,
    created_at: admin.firestore.FieldValue.serverTimestamp()
  }

  const docRef = db.collection("batches").doc()
  await docRef.set(metadata)

  // URI → your backend endpoint
  const metadataURI = `https://api.yourapp.com/nft/${docRef.id}` // Placeholder URI

  const tx = {
    TransactionType: "NFTokenMint", //Specifies the type of operation to perform: minting: NFTokenMint, sending XRP: Payment, creating offer: NFTokenCreateOffer, etc.
    Account: wallet.address, 
    URI: xrpl.convertStringToHex(metadataURI), // why convert to hex? because XRPL requires it to be in hex format for URIs
    Flags: xrpl.NFTokenMintFlags.tfTransferable,  // what are flags? Flags are values from 1, 2, 4, 8, etc. that modify the behavior of the transaction. 8 heres make the NFT transferable.
    NFTokenTaxon: 0 // Taxon is a way to categorize NFTs. 0 means no specific category.
  }

  const result = await client.submitAndWait(tx, { wallet }) // Submit the transaction to the XRPL network and wait for it to be validated

  const tokenId =
    result.result.meta.nftoken_id || // Directly access nftoken_id if available
    result.result.meta.AffectedNodes.find( // Find the NFTokenPage node in AffectedNodes (older responeses may not have direct nftoken_id)
      n => n.CreatedNode?.LedgerEntryType === "NFTokenPage"
    )

  await docRef.update({
    xrpl_token_id: tokenId,
    xrpl_account: wallet.address
  })

  await client.disconnect()

  return {
    firestore_id: docRef.id,
    xrpl_token_id: tokenId
  }
}

module.exports = { mintDrugNFT }
