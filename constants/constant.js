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

module.exports.getTotalAmountTransfer = getTotalAmountTransfer = (
    contractAddress
) => {
    return `select el."totalAmountTransfer"  from public."eventListed" el where "contractAddress" like '${contractAddress}'`;
};

module.exports.getSearchTransacationHash = getSearchTransacationHash = (
    transactionHash
) => {
    return `select * from search_columns('${transactionHash}');`;
};

module.exports.setSearchColumeFunction = setSearchColumeFunction = () => {
    return `CREATE OR REPLACE FUNCTION search_columns(
        needle text,
        haystack_tables name[] default '{}',
        haystack_schema name[] default '{}'
    )
    RETURNS table(schemaname text, tablename text, columnname text, rowctid text)
    AS $$
    begin
      FOR schemaname,tablename,columnname IN
          SELECT c.table_schema,c.table_name,c.column_name
          FROM information_schema.columns c
            JOIN information_schema.tables t ON
              (t.table_name=c.table_name AND t.table_schema=c.table_schema)
            JOIN information_schema.table_privileges p ON
              (t.table_name=p.table_name AND t.table_schema=p.table_schema
                  AND p.privilege_type='SELECT')
            JOIN information_schema.schemata s ON
              (s.schema_name=t.table_schema)
          WHERE (c.table_name=ANY(haystack_tables) OR haystack_tables='{}')
            AND (c.table_schema=ANY(haystack_schema) OR haystack_schema='{}')
            AND t.table_type='BASE TABLE'
      LOOP
        FOR rowctid IN
          EXECUTE format('SELECT ctid FROM %I.%I WHERE cast(%I as text)=%L',
           schemaname,
           tablename,
           columnname,
           needle
          )
        LOOP
          -- uncomment next line to get some progress report
          -- RAISE NOTICE 'hit in %.%', schemaname, tablename;
          RETURN NEXT;
        END LOOP;
     END LOOP;
    END;
    $$ language plpgsql;`;
};
