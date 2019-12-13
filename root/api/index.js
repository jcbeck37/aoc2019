const http = require('http');
// const bodyParser = require("body-parser");
const express = require('express');
const fileUpload = require('express-fileupload');


const app = express();
const serverPort = 8080;
app.use(fileUpload());

const challenges = require('./challenges')({}); // { services, helpers, models });
const controllers = require('./controllers')({ challenges });
const routes = require('./routes')({
  router: express,
  controllers,
});

app.use('/challenges', routes.challenges);

// Start the server
http.createServer(app).listen(serverPort, () => {
  console.log(
    'Advent of Code API is listening on port %d (http://localhost:%d)',
    serverPort,
    serverPort,
  );
});
