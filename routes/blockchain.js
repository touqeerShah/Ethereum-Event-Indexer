const express = require("express");
const {
    getTotalAmount,
    verifyHashDB,
    verifyHash,
} = require("../controller/blockchainController");
const router = express.Router();
// following are the routes which we used to expose the  backend service
router.get("/getTotalAmount", getTotalAmount);
router.get("/verifyHashDB", verifyHashDB);
router.get("/verifyHash", verifyHash);

module.exports = router;
