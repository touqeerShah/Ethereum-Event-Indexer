var ethers = require("ethers");
var abi = require("../../config/abi");
const fs = require("fs");
var abiSigaturePath = "../../config/event_signature.json";
var utils = ethers.utils;
// var bytesArrary = utils.toUtf8Bytes("");
// var signature = utils.keccak256(bytesArrary);

var allEvent = abi.contractAbi.filter(function (el) {
    return el.type == "event";
});

var eventSingature = {};
// console.log("allEvent == ", allEvent);

// {"singature":{"Name":"","Parameters":{"field1":"type1"},"Index":["field1","feild2"]}
console.log("Found ", allEvent.length + " Number Of Event in ABI");
console.log("Start Create Event Signature ....");

allEvent.forEach((event) => {
    var tem = {};
    var isComma = false;

    var functionSignature = event.name + "(";
    tem["Name"] = event.name;
    tem["Parameters"] = [];
    tem["Index"] = [];
    event.inputs.forEach((input) => {
        tem["Parameters"].push(
            JSON.parse(`{"` + input.name + `":" ` + input.type + `"}`)
        );
        if (isComma) {
            functionSignature += ",";
        }
        // console.log(isComma, "  functionSignature", functionSignature);
        input.indexed ? tem["Index"].push(input.name) : "";
        functionSignature += input.type;
        isComma = true;
    });
    functionSignature += ")";
    console.log("functionSignature", functionSignature);
    var bytesArrary = utils.toUtf8Bytes(functionSignature);
    var signature = utils.keccak256(bytesArrary);
    eventSingature[signature] = tem;
});
fs.writeFileSync(abiSigaturePath, JSON.stringify(eventSingature));
console.log("Finish Create Event Signature .... Path", abiSigaturePath);
