module.exports.basicTableStructure = (table, addtionalFields) => {
    return `CREATE TABLE IF NOT EXISTS ${table} (
	    "transactionId" VARCHAR(40) NOT NULL,
        "blockNumber" VARCHAR(40) NOT NULL,
	    ${addtionalFields}
	    PRIMARY KEY ("transactionId")
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
