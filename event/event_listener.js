// Setup: npm install alchemy-sdk
var Alchemy = require("alchemy-sdk");

// Optional config object, but defaults to demo api-key and eth-mainnet.
const settings = {
    apiKey: "DgXMmR0mlY0FxLZwrFaedipAJrAV5geS", // Replace with your Alchemy API Key.
    network: Alchemy.Network.ETH_MAINNET, //goerli Replace with your network.
};

const alchemy = new Alchemy.Alchemy(settings);

// Subscription for new blocks on Eth Mainnet.
var blockNumber = alchemy.ws.on("block", (blockNumber) =>
    console.log("The latest block number is", blockNumber)
);

// // Subscription for Alchemy's pendingTransactions Enhanced API
// alchemy.ws.on(
//   {
//     method: "alchemy_pendingTransactions",
//     toAddress: "vitalik.eth",
//   },
//   (tx) => console.log(tx)
// );
// // Subscription for Alchemy's pendingTransactions Enhanced API
let options = {
    address: "0x3506424f91fd33084466f402d5d97f05f8e3b4af", //Only get events from specific addresses
    topics: [], //What topics to subscribe to
};
const fs = require("fs").promises;

alchemy.ws.on(options, async (tx) => {
    console.log(tx);
    var arr = await alchemy.core.getLogs({
        fromBlock: 15655991,
        // toBlock: 7693078,
        contractAddress: ["0x3506424f91fd33084466f402d5d97f05f8e3b4af"],
    });

    console.log("arr", arr[arr.length - 1]);
    process.exit(1);
});
