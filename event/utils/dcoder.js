var ethers = require("ethers");
const decoder = new ethers.utils.AbiCoder();

/**
 *  This will help us once we have log we have to convert that data to the values whicha are undersatanable and then store into DB
 * @param {*} type
 * @param {*} data
 * @returns
 */
module.exports.decodeData = (type, data) => {
    const decodeData = decoder.decode([type], data);
    return decodeData;
};
