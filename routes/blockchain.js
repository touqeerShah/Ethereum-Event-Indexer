const express = require("express");
const {
    getTotalAmount,
    verifyHash,
} = require("../controller/blockchainController");
const router = express.Router();
// following are the routes which we used to expose the  backend service
router.get("/getTotalAmount", getTotalAmount);
router.get("/verifyHash", verifyHash);

module.exports = router;
