// Setup: npm install alchemy-sdk
var Alchemy = require("alchemy-sdk");
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
// Optional config object, but defaults to demo api-key and eth-mainnet.
// const settings = {
//     apiKey: configObj.ALCHEMY_APIKEY, // Replace with your Alchemy API Key.
//     network: Alchemy.Network.ETH_MAINNET, //goerli Replace with your network.
// };
const RPC_ENDPOINT =
    "wss://mainnet.infura.io/ws/v3/eb19eeafefff4d9eb07ed30adcad89a1";
const web3 = new Web3(RPC_ENDPOINT);

async function event() {
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

    // await insertEventData(pool, test);
    // console.log("settings", settings);
    // const alchemy = new Alchemy.Alchemy(settings);
    // var blockNumber = alchemy.ws.on("block", (blockNumber) =>
    //     console.log("The latest block number is", blockNumber)
    // );

    // let options = {
    //     address: configObj.CONTRACT_ADDRESS, //Only get events from specific addresses
    //     topics: [], //What topics to subscribe to
    // };
    // alchemy.ws.on(options, async (tx) => {
    //     console.log(tx.blockNumber);
    //     if (tx.blockNumber - 1 != 15663004) {
    //         var eventsLogs = await alchemy.core.getLogs({
    //             fromBlock: 15663004,
    //             toBlock: tx.blockNumber,
    //             address: configObj.CONTRACT_ADDRESS,
    //             // contractAddress: [configObj.CONTRACT_ADDRESS],
    //         });
    //         for (let index = 0; index < eventsLogs.length; index++) {
    //             // const element = eventsLogs[index];
    //             if (eventsLogs[index] == configObj.CONTRACT_ADDRESS)
    //                 await insertEventData(pool, eventsLogs[index]);
    //         }
    //     } else {
    //         if (eventsLogs[index] == configObj.CONTRACT_ADDRESS)
    //             await insertEventData(pool, eventsLogs[index]);
    //     }
    //     var response = await execute(
    //         updateStartBlock(tx.blockNumber, configObj.CONTRACT_ADDRESS),
    //         pool
    //     );
    //     if (response.status) {
    //         console.log("update Starting Block Number ");
    //     }
    //     process.exit(1);
    // });

    let options = {
        fromBlock: "15663324",
        address: ["0x3506424f91fd33084466f402d5d97f05f8e3b4af"], //Only get events from specific addresses
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
}

event();
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
            console.log(
                "event_signature[eventObject.topics[0]]",
                event_signature[eventObject.topics[0]]
            );
            if (
                eventObject.topics[0] ==
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            ) {
                var response = await execute(
                    updateTotalAmountTransfer(data, configObj.CONTRACT_ADDRESS),
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
