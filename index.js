const express = require('express');
const app = express();
const Moment = require('moment-timezone');

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res) {
    res.send('Hello world');
});

app.get('/time', (req, res) => {
    const osloTime = Moment().tz('Europe/Oslo').format('DD MMM YYYY - HH:mm');
    const bkkTime = Moment().tz('Asia/Bangkok').format('DD MMM YYYY - HH:mm');
    res.send(`Oslo ${osloTime}\nBangkok ${bkkTime}`);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});