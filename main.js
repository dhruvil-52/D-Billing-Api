const express = require("express");
const config = require("./config");
const http = require("http");
const routes = require("./routes/index");
var bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.use(cors())

app.set('port', config.get('server.port'));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '75000kb'
}));

// Enable request body parsing in JSON format
app.use(bodyParser.json({
    limit: '75000kb'
}));
routes(app);


var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("dbilling api running on " + config.get('server.port') + " port")
});