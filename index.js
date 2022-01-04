const express = require('express');
const webRouter = require('./main').configRouter();
const path = require('path');

var app = express(); //setting up app

app.use(express.json()); //to read mrequest body
app.get('/', (req, res) => { res.send('OK') }); //ping to check server availability
app.use('/webhook', webRouter); //webhook requests for IPL questions
app.get('/bot', (req, res) => { res.sendFile(path.join(__dirname, '/index.html')); }); //UI Loading

var server = app.listen(80, () => { //setting up server
    console.log('Server started on port 80');
});

module.exports = server;