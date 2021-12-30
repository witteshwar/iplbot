const express = require('express');
const webhook = require('./main');

var app = express();

app.use('/', webhook);

var server = app.listen(8081, () => {
    console.log('Server started on port 8081')
});