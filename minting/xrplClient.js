const xrpl = require("xrpl")

async function getClient() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233") //XRPL Testnet URL
  await client.connect() // Connect to the XRPL testnet
  return client
}

module.exports = { getClient } //Export getClient function for use in other files