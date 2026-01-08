const express = require("express");
const router = express.Router();
const verifyController = require("./verify.controller.js");

router.post("/verify", verifyController.verify);

module.exports = router;
