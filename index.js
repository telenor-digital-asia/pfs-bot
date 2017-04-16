const bodyParser = require('body-parser');
const express = require('express');
const Moment = require('moment-timezone');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res) {
    res.send('Hello world');
});

app.post('/time', (req, res) => {
    const timezoneList = {
        no: 'Europe/Oslo',
        th: 'Asia/Bangkok',
        bd: 'Asia/Dhaka',
        pk: 'Asia/Karachi',
        mm: 'Asia/Yangon'
    };

    let countryCodes = req.body.text && req.body.text.toLowerCase() || '';
    if(countryCodes === '' || countryCodes === 'all') {
        countryCodes = 'no,th,bd,pk,mm'
    }

    let text = countryCodes.split(',').map((code) => {
        if(timezoneList[code]) {
            const time = Moment().tz(timezoneList[code]).format('DD MMM YYYY - HH:mm');
            return `${timezoneList[code]} ${time}`;
        }
        return '';
    });

    res.json(
        {
            "response_type": "in_channel",
            "text": text
        }
    );
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});