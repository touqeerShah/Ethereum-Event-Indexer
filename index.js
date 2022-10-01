var express = require("express"); // call express
var app = express(); // define our app using express
var http = require("http");

var bodyParser = require("body-parser");
var { configObj } = require("./config/config.js");
var routes = require("./routes/blockchain");

const protocol = "http";

let server;

app.use(bodyParser.json());

app.use("/api", routes);

server = http.createServer(app);
const PORT = configObj.PORT || 8081;
server.listen(PORT, () => {
    console.info(
        `Please open web browser to access ：${protocol}://${configObj.host}:${PORT}/`
    );

    console.info(`pid is ${process.pid}`);
});
