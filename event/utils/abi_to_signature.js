var ethers = require("ethers");
var utils = ethers.utils;
var bytesArrary = utils.toUtf8Bytes("");
var signature = utils.keccak256(bytesArrary);
