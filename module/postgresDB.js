const { Pool } = require("pg");
var { configObj } = require("../config/config.js");
/**
 * it will run before every thing and it should be connected
 * @param {*} url mongoDB url
 * @returns
 */
try {
    const pool = new Pool({
        user: configObj.POSTGRESSDB_USER,
        database: configObj.POSTGRESSDB_DB,
        password: configObj.POSTGRESSDB_PASS,
        port: configObj.POSTGRESSDB_PORT,
        host: configObj.POSTGRESSDB_ADDRESS,
    });
    module.exports = { pool };
} catch (error) {
    console.log("Error To connect PG try again after 5 second");
}

module.exports.execute = async (query, pool) => {
    var response = {};
    try {
        var result = await pool.query(query); // sends queries
        response["result"] = result;
        response["status"] = true;

        return response;
    } catch (error) {
        // console.error(error.stack);
        response["result"] = {};
        response["status"] = false;
        return response;
    }
};
