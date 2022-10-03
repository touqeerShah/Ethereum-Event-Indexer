var { pool, execute } = require("../module/postgresDB");
var { getTotalAmountTransfer } = require("./../constants/constant");
var { configObj } = require("../config/config");
const Web3 = require("web3");

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
module.exports.verifyHashDB = async (req, res) => {
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

// this will get the value and tell you in does that transaction hash exist from Contract Address
module.exports.verifyHash = async (req, res) => {
    var response = { message: "Found", result: true };
    const RPC_ENDPOINT = `wss://mainnet.infura.io/ws/v3/${configObj.INFURA_APIKEY}`;

    var web3 = new Web3(RPC_ENDPOINT);
    const transactionHash = req.query.transactionHash;
    try {
        web3.eth.getTransaction(transactionHash, function (error, result) {
            console.log("result", result);
            if (result) {
                if (result.to.toLowerCase() == configObj.CONTRACT_ADDRESS) {
                    res.send(response);
                }
            } else {
                response.message = "NoT Found";
                response.result = false;

                res.send(response);
            }
        });
    } catch (error) {
        response.message = "Error to connect Web3";
        response.result = false;

        res.send(response);
    }
};
