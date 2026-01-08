const xrpl = require('xrpl');

async function testConnection() {
    const SERVER_URL = "wss://s.altnet.rippletest.net:51233/"
    const client = new xrpl.Client(SERVER_URL)
    await client.connect()
    console.log("Connected to Testnet")

  try {
    const response = await client.request({
      command: 'account_info',
      account: 'rLYudJMw4SJYpcLshfi8VZp1te8CKFgBxN',
      ledger_index: 'validated'
    });
    console.log('Full response:', JSON.stringify(response, null, 2));
    const balance = response.result?.account_data?.Balance || response.account_data?.Balance;
    console.log('✅ Connected! Account balance:', balance, 'drops');
  } catch (e) {
    console.log('❌ Error:', e.message);
  } finally {
    await client.disconnect();
  }
}

testConnection();

