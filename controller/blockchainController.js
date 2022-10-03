var { pool, execute } = require("../module/postgresDB");
var { getTotalAmountTransfer } = require("./../constants/constant");
var { configObj } = require("../config/config");

module.exports.getTotalAmount = async (req, res) => {
    await pool.connect(); // gets connection
    var response = await execute(
        getTotalAmountTransfer(configObj.CONTRACT_ADDRESS),
        pool
    );
    if (response.status) {
        response.result = response.result.rows[0].totalAmountTransfer;
    }

    res.send(response);
};
module.exports.verifyHash = async (req, res) => {
    await pool.connect(); // gets connection
    var response = await execute(
        getSearchTransacationHash(req.query.transactionHash),
        pool
    );
    if (response.status) {
        response.result = response.result.rows[0];
    }
    res.send(response);
};
