var ethers = require("ethers");
var abi = require("../../config/abi");
const fs = require("fs");
var abiSigaturePath = "./../config/event_signature.json";
var utils = ethers.utils;

/**
 * This function is user to get the ABI and convert them into it Signature
 * Which we used into create table and do transactions
 */
module.exports.setupABISignature = async () => {
    var allEvent = abi.contractAbi.filter(function (el) {
        // here we get only those object whose type is Event from ABI
        return el.type == "event";
    });

    var eventSingature = {};

    // {"singature":{"Name":"","fieldsName":[],"fieldsType":[],"Index":["field1","feild2"]}
    console.log("Found ", allEvent.length + " Number Of Event in ABI");
    console.log("Start Create Event Signature ....");

    allEvent.forEach((event) => {
        var tem = {};
        var isComma = false;

        var functionSignature = event.name + "(";
        tem["Name"] = event.name;
        tem["fieldsName"] = [];
        tem["fieldsType"] = [];
        tem["Index"] = [];
        event.inputs.forEach((input) => {
            // here we create event object to signature based object
            tem["fieldsName"].push(input.name);
            tem["fieldsType"].push(input.type);
            if (isComma) {
                functionSignature += ",";
            }
            // console.log(isComma, "  functionSignature", functionSignature);
            input.indexed ? tem["Index"].push(input.name) : "";
            functionSignature += input.type;
            isComma = true;
        });
        functionSignature += ")";
        console.log("functionSignature", functionSignature); //
        var bytesArrary = utils.toUtf8Bytes(functionSignature);
        var signature = utils.keccak256(bytesArrary); // Transfer(address,address,unit256) -> function signature
        eventSingature[signature] = tem;
    });
    fs.writeFileSync(abiSigaturePath, JSON.stringify(eventSingature)); // once it done put them into file so we can used them
    console.log("Finish Create Event Signature .... Path", abiSigaturePath);
};
