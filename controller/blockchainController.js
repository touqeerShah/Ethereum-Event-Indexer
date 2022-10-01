var { pool } = require("../module/postgresDB");

module.exports.getTotalAmount = async (req, res) => {
    const res = await pool.query(
        "SELECT * FROM EvonikEvent where transactionId = $1",
        [eventObject.transactionId]
    );
    console.log("Query => ", res.rowCount);
};
module.exports.verifyHash = async (req, res) => {};
