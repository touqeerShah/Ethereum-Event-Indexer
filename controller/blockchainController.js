var { pool, execute } = require("../module/postgresDB");
var { getTotalAmountTransfer } = require("./../constants/constant");
var { configObj } = require("../config/config");

// this API endpoint will get total Amount from DB and send back as response
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

// this will get the value and tell you in does that transaction hash exist in DB or not
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
