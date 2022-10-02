var { setupABISignature } = require("./../event/utils/abi_to_signature");
var { CreateTables } = require("./setupDB");
async function init() {
    await setupABISignature();
    await CreateTables();
}
init();
