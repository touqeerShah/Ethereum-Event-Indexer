require("dotenv").config();
// console.log(process.env)
module.exports.configObj = {
  MONGO_ADDRESS: process.env.MONGO_ADDRESS,
  MONGO_PORT: process.env.MONGO_PORT,
  MONGO_DB: process.env.MONGO_DB,
  MONGO_PASS: process.env.MONGO_PASS,
  MONGO_USER: process.env.MONGO_USER,
  PORT: process.env.PORT,
  EXPLORER_URL: process.env.EXPLORER_URL,
  EXPLORER_PORT: process.env.EXPLORER_PORT,
  EXPLORER_USERNAME: process.env.EXPLORER_USERNAME,
  EXPLORER_PASSWORD: process.env.EXPLORER_PASSWORD,
  EXPLORER_NETWORK: process.env.EXPLORER_NETWORK,
  sslcertsPath: process.env.keyValueStore,
  sslEnabled: process.env.sslEnabled,
  host: process.env.HOST,
  EXPLORER_TOKENSECRET: process.env.EXPLORER_TOKENSECRET,
  WEBSOCKET_PORT: process.env.WEBSOCKET_PORT,
};
