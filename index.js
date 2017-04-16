const bodyParser = require('body-parser');
const express = require('express');
const Moment = require('moment-timezone');
const _ = require('lodash');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res) {
    res.send('Hello world');
});

app.post('/time', (req, res) => {
    const countryList = {
        no: {
            name: 'Oslo',
            timezone: 'Europe/Oslo'
        },
        th: {
            name: 'Bangkok',
            timezone: 'Asia/Bangkok'
        },
        bd: {
            name: 'Dhaka',
            timezone: 'Asia/Dhaka'
        },
        pk: {
            name: 'Islamabad',
            timezone: 'Asia/Karachi'
        },
        mm: {
            name: 'Yangon',
            timezone: 'Asia/Yangon',
        }
    };

    let countryCodes = req.body.text && req.body.text.toLowerCase() || '';
    if(countryCodes === '' || countryCodes === 'all') {
        countryCodes = 'no,pk,bd,mm,th'
    }

    let result = countryCodes.split(',').map((code) => {
        const country = countryList[code];
        if(country) {
            const time = Moment().tz(country.timezone).format('ddd DD MMM YY - HH:mm (UTCZ)');
            return `_*${country.name}* ${time}_`;
        }
    });

    let responseType = 'ephemeral';
    let text = 'Only `all` and countries code (`no`,`pk`,`bd`,`mm`,`th`) are supported. Multi countries are allowed by comma separating.';

    if (_.every(result)) {
        responseType = 'in_channel';
        text = _.join(result, '\n');
    }

    res.json(
        {
            'response_type': responseType,
            'text': text
        }
    );
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;