const xrpl = require('xrpl');

const SERVER_URL = process.env.XRPL_WS || 'wss://s.altnet.rippletest.net:51233';


const XRPL_ACCOUNT = process.env.XRPL_ACCOUNT;

async function getNftInfo(nftId) {
  const client = new xrpl.Client(SERVER_URL);
  await client.connect();
  try {
    // Query all NFTs for the account
    const resp = await client.request({
      command: 'account_nfts',
      account: XRPL_ACCOUNT,
      ledger_index: 'validated'
    });

    const nfts = resp.result.account_nfts || [];
    const nft = nfts.find(n => n.NFTokenID === nftId);

    if (!nft) return null;

    let uri = null;
    if (nft.URI) {
      try {
        uri = Buffer.from(nft.URI, 'hex').toString('utf8');
      } catch (e) {
        uri = nft.URI;
      }
    }

    return {
      nft_id: nft.NFTokenID,
      issuer: XRPL_ACCOUNT,
      uri,
      nft_serial: nft.NFTokenSerial || null
    };
  } catch (e) {
    throw e;
  } finally {
    await client.disconnect();
  }
}

module.exports = { getNftInfo };