/**
 * Created by bharatbatra on 10/27/16.
 */
'use strict';


import SERVER_ENV from './ServerEnv';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';

var PORT = null;
switch (SERVER_ENV.ENV) {
    case 'DEVELOPMENT':
        PORT = 8000;
        break;

    case 'PRODUCTION':
        PORT = 80;
        break;
}

// Initialize the express application
var app = express();


/*
Enable CORS with Wide Open CORS Mapping.
For increased security, alter the Access-Control-Allow-Origin paramter
*/
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, *');
    next();
});

// Set up the application's body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static content located in Frontend/src/
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/*', function(req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, function(){
   console.log("Listening on Port " + PORT);
});
