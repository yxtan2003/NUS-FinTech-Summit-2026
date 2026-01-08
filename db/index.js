const db = require("./firebase.js");

async function findBatchByChipId(chipId) {
  const snapshot = await db
    .collection("batches")
    .where("chip_id", "==", chipId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  return snapshot.docs[0].data();
}

module.exports = {
  findBatchByChipId
};