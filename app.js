var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dotEnv = require('dotenv').config();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var db = require('./db');
var router = express.Router();

var indexRouter = require('./routes/index');
var playersRouter = require('./routes/players');
var campaignsRouter = require('./routes/campaigns');

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use('/', indexRouter);
app.use('/players', playersRouter);
app.use('/campaigns', campaignsRouter);

const PORT = process.env.PORT || process.env.Port;
http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});


