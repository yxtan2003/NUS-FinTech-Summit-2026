const db = require("../db"); //TBU
const logAttempt = require("./verify.log.js");

exports.verify = async (chipId) => {
  const batch = await db.findBatchByChipId(chipId);

  if (!batch) {
    logAttempt(chipId, "counterfeit");
    return { status: "counterfeit" };
  }

  logAttempt(chip_id, "authentic");

  return {
    status: "authentic",
    batch_id: batch.batch_id,
    drug_name: batch.drug_name
  };
};