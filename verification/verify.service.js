
const { logAttempt } = require("./verify.log.js");
const { getNftInfo } = require("../db/xrpl-client");
const { db } = require("../db/firebase.js");


exports.verify = async (chipId) => {
  if (!chipId) {
    logAttempt(chipId, "counterfeit");
    return { status: "counterfeit" };
  }

  // 1) Query Firestore for document referencing this chip public key
  let docSnapshot;
  try {
    // try the field your friend used first, then fall back to older field name
    let snapshot = await db
      .collection('batches')
      .where('chip_public_key', '==', chipId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      logAttempt(chipId, 'counterfeit');
      return { status: 'counterfeit' };
    }

    docSnapshot = snapshot.docs[0];
  } catch (e) {
    logAttempt(chipId, 'counterfeit');
    return { status: 'counterfeit', error: 'db_error', message: e.message };
  }

  const firebaseData = docSnapshot.data();

 
  const tokenId = firebaseData.xrpl_token_id;

  // 2) Query XRPL for NFT info using the token ID
  let nftInfo;
  try {
    nftInfo = await getNftInfo(tokenId);
  } catch (e) {
    logAttempt(chipId, 'counterfeit');
    return { status: 'counterfeit', error: 'xrpl_error', message: e.message };
  }

  if (!nftInfo) {
    logAttempt(chipId, 'counterfeit');
    return { status: 'counterfeit' };
  }


  // 3) Resolve metadata: prefer on-ledger (nftInfo.uri) if it's JSON, otherwise fall back to firebase stored metadata
  let metadata = null;
  if (nftInfo.uri) {
    try {
      metadata = JSON.parse(nftInfo.uri);
    } catch (e) {
      metadata = nftInfo.uri;
    }
  } else {
    // fallback to firebase stored metadata (structure your documents accordingly)
    metadata = {
      manufacturer: firebaseData.manufacturer,
      manufacturing_date: firebaseData.manufacturing_date,
      expiry_date: firebaseData.expiry_date,
      chip_public_key: firebaseData.chip_public_key || firebaseData.chip_id || firebaseData.chipId,
      batch_id: firebaseData.batch_id,
      drug_name: firebaseData.drug_name,
      description: firebaseData.description,
      created_at: firebaseData.created_at,
      xrpl_account: firebaseData.xrpl_account,
      xrpl_token_id: firebaseData.xrpl_token_id
    };
  }

  logAttempt(chipId, 'authentic');

  return {
    status: 'authentic',
    token_id: tokenId,
    nft_id: nftInfo.nft_id || tokenId,
    issuer: nftInfo.issuer || null,
    metadata_source: nftInfo.uri ? 'xrpl' : 'firebase',
    metadata
  };
};