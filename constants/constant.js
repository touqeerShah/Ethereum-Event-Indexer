module.exports.basicTableStructure = (table, addtionalFields) => {
    return `CREATE TABLE IF NOT EXISTS ${table} (
	    "transactionHash" VARCHAR(70) NOT NULL,
        "contractAddress" VARCHAR(70) NOT NULL,
        "blockNumber" Numeric NOT NULL,
	    ${addtionalFields}
	    PRIMARY KEY ("transactionHash")
    );`;
};

module.exports.basicIndexStructure = (table, indexField) => {
    return `CREATE INDEX ${table} 
    ON ${indexField};`;
};

module.exports.eventListed = `
    CREATE TABLE IF NOT EXISTS "eventListed" (
	    "chainId" VARCHAR(5) NOT NULL,
	    "chainName" VARCHAR(50) NOT NULL,
        "contractAddress" VARCHAR(50) NOT NULL,
	    "startBlockNumber" Numeric NOT NULL,
	    "totalAmountTransfer" Numeric NOT NULL,
        PRIMARY KEY ("chainId")
    );`;
module.exports.insertEventListed = insertEventListed = (configObj) => {
    return `INSERT INTO public."eventListed" ("chainId", "chainName", "contractAddress", "startBlockNumber","totalAmountTransfer")
    VALUES ('${configObj.CHAIN_ID}', '${configObj.CHAIN_NAME}', '${configObj.CONTRACT_ADDRESS}', ${configObj.STRARTFROM},0)`;
};

module.exports.getStartingBlock = getStartingBlock = (contractAddress) => {
    return `select el."startBlockNumber"  from public."eventListed" el where "contractAddress" like '${contractAddress}'`;
};

module.exports.basicInsertStructure = (table, addtionalFields, values) => {
    return `INSERT INTO ${table} (
	    "transactionHash" ,
        "contractAddress",
        "blockNumber",
	    ${addtionalFields}
    ) VALUES (${values})`;
};

module.exports.updateStartBlock = (startBlockNumber, contractAddress) => {
    return `UPDATE public."eventListed"
    SET "startBlockNumber"=${startBlockNumber}
    WHERE  "contractAddress" like '${contractAddress}';
    `;
};

module.exports.updateTotalAmountTransfer = (
    newAmountTransfer,
    contractAddress
) => {
    return `UPDATE public."eventListed" el 
    SET "totalAmountTransfer"= "totalAmountTransfer"+${newAmountTransfer} 
    where "contractAddress" like '${contractAddress}';
    `;
};
