require("dotenv").config();
// console.log(process.env)
module.exports.configObj = {
    POSTGRESSDB_ADDRESS: process.env.POSTGRESSDB_ADDRESS,
    POSTGRESSDB_PORT: process.env.POSTGRESSDB_PORT,
    POSTGRESSDB_DB: process.env.POSTGRESSDB_DB,
    POSTGRESSDB_PASS: process.env.POSTGRESSDB_PASS,
    POSTGRESSDB_USER: process.env.POSTGRESSDB_USER,
    PORT: process.env.PORT,
    host: process.env.HOST,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    CHAIN_ID: process.env.CHAIN_ID,
    CHAIN_NAME: process.env.CHAIN_NAME,
    STRARTFROM: process.env.STRARTFROM,
};
