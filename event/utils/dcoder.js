var ethers = require("ethers");
const decoder = new ethers.utils.AbiCoder();

module.exports.decodeData = (type, data) => {
    const decodeData = decoder.decode([type], data);
    return decodeData;
};
