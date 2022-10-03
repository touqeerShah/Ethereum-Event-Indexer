var { pool } = require("../module/postgresDB");
var {
    basicTableStructure,
    basicIndexStructure,
    eventListed,
    insertEventListed,
} = require("../constants/constant");
var event_signature = require("../config/event_signature.json");
var { configObj } = require("../config/config");
const execute = async (query) => {
    try {
        await pool.query(query); // sends queries
        return true;
    } catch (error) {
        // console.error(error.stack);
        return false;
    }
};
module.exports.CreateTables = async () => {
    try {
        await pool.connect(); // gets connection
        console.log("Connected to Postgres");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    console.log("Creating Event Table ....");
    await execute(eventListed).then(async (result) => {
        if (result) {
            console.log("Event Table created");
            result = await execute(insertEventListed(configObj));
            if (result) {
                console.log("Basic Info Added Event");
            }
        }
    });

    for (const eventTabl in event_signature) {
        var tableFields = "";
        var indexField = "";
        // console.log(`${eventTabl}: ${event_signature[eventTabl]}`);
        for (const i in event_signature[eventTabl].fieldsName) {
            tableFields += `"${event_signature[eventTabl].fieldsName[i]}"`;
            if (event_signature[eventTabl].fieldsType[i] == "uint256") {
                tableFields += " Numeric NOT NULL,";
            } else {
                tableFields += " VARCHAR(50) NOT NULL,";
            }
        }
        for (const i in event_signature[eventTabl].Index) {
            if (i > 0) {
                indexField += ",";
            }
            indexField += `"${event_signature[eventTabl].Index[i]}"`;
        }
        indexField = event_signature[eventTabl].Name + "(" + indexField + ")";

        await execute(
            basicTableStructure(event_signature[eventTabl].Name, tableFields)
        ).then(async (result) => {
            if (result) {
                console.log(event_signature[eventTabl].Name, " Table created");
                if (event_signature[eventTabl].Index.length != 0) {
                    result = await execute(
                        basicIndexStructure(
                            "index_" + event_signature[eventTabl].Name,
                            indexField
                        )
                    );
                    if (result) {
                        console.log(
                            "Indexing Created On" +
                                event_signature[eventTabl].Name +
                                " Event"
                        );
                    }
                }
            } else {
                console.log(
                    "Table Already Exists",
                    event_signature[eventTabl].Name
                );
            }
        });
    }
    // await pool.end();
    console.log("Done");
    process.exit(0);
};
// CreateTables();
// console.log("configObj", process.env);
