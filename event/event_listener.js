// Setup: npm install alchemy-sdk
const Web3 = require("web3");

var { configObj } = require("../config/config");
var { pool, execute } = require("../module/postgresDB");
var {
    getStartingBlock,
    basicInsertStructure,
    updateStartBlock,
    updateTotalAmountTransfer,
} = require("./../constants/constant");
var event_signature = require("../config/event_signature.json");
var { decodeData } = require("./utils/dcoder");

const RPC_ENDPOINT = `wss://mainnet.infura.io/ws/v3/${configObj.INFURA_APIKEY}`;
const web3 = new Web3(RPC_ENDPOINT);

module.exports.event = async () => {
    await pool.connect(); // gets connection
    var response = await execute(
        getStartingBlock(configObj.CONTRACT_ADDRESS),
        pool
    );
    if (!response.status) {
        console.log("Unable to fatch Record ");
        process.exit(1);
    }
    // console.log("startBlockNumber", response.result.rows[0].startBlockNumber);
    var startBlockNumber = response.result.rows[0].startBlockNumber;

    let options = {
        fromBlock: startBlockNumber,
        address: [configObj.CONTRACT_ADDRESS], //Only get events from specific addresses
        topics: [], //What topics to subscribe to
    };
    var count = 0;
    let subscription = web3.eth.subscribe(
        "logs",
        options,
        async (err, event) => {
            if (!err) {
                console.log(count, event);
                count++;
                // if (
                //     event.address ==
                //     "0x3506424F91fD33084466F402d5D97f05F8e3b4AF"
                // )
                await insertEventData(pool, event);
                console.log(
                    updateStartBlock(
                        event.blockNumber,
                        configObj.CONTRACT_ADDRESS
                    )
                );
                var response = await execute(
                    updateStartBlock(
                        event.blockNumber,
                        configObj.CONTRACT_ADDRESS
                    ),
                    pool
                );
                if (response.status) {
                    console.log("update Starting Block Number ");
                }
                // process.exit(1);
            }
        }
    );
};

async function insertEventData(pool, eventObject) {
    var tableFields = "";
    var tabledata =
        `'${eventObject.transactionHash}'` +
        "," +
        `'${eventObject.address}'` +
        "," +
        `${eventObject.blockNumber}` +
        ",";
    for (const i in event_signature[eventObject.topics[0]].fieldsName) {
        if (i != 0) tableFields += ",";
        tableFields += `"${
            event_signature[eventObject.topics[0]].fieldsName[i]
        }"`;
    }

    for (let index = 1; index < eventObject.topics.length; index++) {
        var data = decodeData(
            event_signature[eventObject.topics[0]].fieldsType[index - 1],
            eventObject.topics[index]
        );
        if (index != 1) {
            tabledata += ",";
        }
        tabledata += `'${data}'`;
    }
    if (eventObject.data != "") {
        var len = event_signature[eventObject.topics[0]].fieldsType.length;
        var data = decodeData(
            event_signature[eventObject.topics[0]].fieldsType[len - 1],
            eventObject.data
        );
        if (
            event_signature[eventObject.topics[0]].fieldsType[len - 1] ==
            "uint256"
        ) {
            tabledata += `,${data}`;
            // console.log(
            //     "event_signature[eventObject.topics[0]]",
            //     event_signature[eventObject.topics[0]]
            // );
            if (eventObject.topics[0] == configObj.TRANSFER_SIGNATURE) {
                const etherValue = Web3.utils.fromWei(data.toString(), "ether");
                console.log("etherValue", etherValue);
                var response = await execute(
                    updateTotalAmountTransfer(
                        etherValue,
                        configObj.CONTRACT_ADDRESS
                    ),
                    pool
                );
                if (response.status) {
                    console.log("update Transfer Amount");
                }
            }
        } else {
            tabledata += `,'${data}'`;
        }
    }
    var tableName = `public."${event_signature[
        eventObject.topics[0]
    ].Name.toLowerCase()}"`;
    // console.log(basicInsertStructure(tableName, tableFields, tabledata));
    var response = await execute(
        basicInsertStructure(tableName, tableFields, tabledata),
        pool
    );
    if (!response.status) {
        console.log(
            "Unable to Insert Record ",
            event_signature[eventObject.topics[0]],
            "Transaction hash ",
            eventObject.transactionHash
        );
        // process.exit(1);
    }
}
