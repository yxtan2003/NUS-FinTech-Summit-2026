const xrpl = require('xrpl');

const SERVER_URL = process.env.XRPL_WS || 'wss://s.altnet.rippletest.net:51233';

async function getNftInfo(nftId, issuerAccount = null) {
  const client = new xrpl.Client(SERVER_URL);
  await client.connect();
  try {
    // Try nft_info first
    try {
      const resp = await client.request({ command: 'nft_info', nft_id: nftId });
      const result = resp.result || resp;
      const nft = result.nft || result;
      if (!nft || Object.keys(nft).length === 0) return null;

      const uriHex = nft.uri || nft.URI || nft.Uri;
      let uri = null;
      if (uriHex) {
        try {
          uri = Buffer.from(uriHex, 'hex').toString('utf8');
        } catch (e) {
          uri = uriHex;
        }
      }

      return {
        nft_id: nft.nft_id || nft.NFTokenID || nft.NFTOKENID,
        issuer: nft.issuer || nft.Issuer,
        uri,
        nft_serial: nft.nft_serial || nft.NFTokenSerial || nft.serial
      };
    } catch (nftInfoErr) {
      // If nft_info is not supported, fall back to account_nfts
      if (nftInfoErr.data && nftInfoErr.data.error === 'unknownMethod') {
        if (!issuerAccount) {
          throw new Error('nft_info unsupported and no issuer account provided for account_nfts fallback');
        }
        return await getNftInfoFromAccountNfts(client, issuerAccount, nftId);
      }
      // If not found, return null
      if (nftInfoErr.data && (nftInfoErr.data.error === 'entryNotFound' || nftInfoErr.data.error === 'actNotFound')) {
        return null;
      }
      throw nftInfoErr;
    }
  } finally {
    await client.disconnect();
  }
}

async function getNftInfoFromAccountNfts(client, account, targetNftId) {
  try {
    const resp = await client.request({
      command: 'account_nfts',
      account: account,
      ledger_index: 'validated'
    });
    const nfts = resp.result?.account_nfts || resp.account_nfts || [];
    
    // Find the NFT with matching ID
    const matchedNft = nfts.find(nft => {
      const nftId = nft.nft_id || nft.NFTokenID;
      return nftId && nftId.toUpperCase() === targetNftId.toUpperCase();
    });
    
    if (!matchedNft) return null;
    
    const uriHex = matchedNft.uri || matchedNft.URI || matchedNft.Uri;
    let uri = null;
    if (uriHex) {
      try {
        uri = Buffer.from(uriHex, 'hex').toString('utf8');
      } catch (e) {
        uri = uriHex;
      }
    }
    
    return {
      nft_id: matchedNft.nft_id || matchedNft.NFTokenID,
      issuer: account,
      uri,
      nft_serial: matchedNft.nft_serial || matchedNft.NFTokenSerial || matchedNft.serial
    };
  } catch (e) {
    if (e.data && (e.data.error === 'actNotFound')) return null;
    throw e;
  }
}

module.exports = { getNftInfo };
