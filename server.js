var express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');

var configDB = require('./configs/database.js');
var port = 8080;
var app = express();

// setup
var router = express.Router();

//database config:
mongoose.connect(configDB.url);

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/users', require('./routes/user'));

// listen port 8080
app.listen(port, () => {
  console.log('Listening on port: ' + port);
});