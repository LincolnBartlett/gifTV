const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/build'));

app.get('/', function (req, res) {
  res.sendFile('./index.html');
});

app.listen(9000);