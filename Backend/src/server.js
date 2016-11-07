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
var parsed = {};
// Initialize Firebase
// var firebase = require("firebase");

// var fb_config = {
//     apiKey: "AIzaSyDqn7Fcr_DllpVKwU0Ufnii0-WhezyjPMo",
//     authDomain: "harmony-dd866.firebaseapp.com",
//     databaseURL: "https://harmony-dd866.firebaseio.com",
//     storageBucket: "harmony-dd866.appspot.com",
//     messagingSenderId: "201771819246"
// };
// firebase.initializeApp(fb_config);

// var db = firebase.database();

var fs = require('fs');

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

    let data = fs.readFileSync(path.join(__dirname, 'data.json'));
    parsed = JSON.parse(data);
});


app.post('/users/all', function(req, res){
    res.send(parsed.Users);
});

/*
TODO: Edit to make this work for the household
 */
//get all chores for this user
app.post("/chores/get",function(req, res){
    let userId = req.body.userId;
    console.log(req.body);
    // let chores = parsed.Chores.filter(chore => chore.owner === userId);
    let chores = parsed.Chores;
    res.send(chores);
});

//add a new chore
app.post("/chores/add", function(req, res){
    let chore = req.body.chore;
    parsed.Chores.push(chore);
    console.log(parsed.Chores)
    res.send(parsed.Chores);
});

app.post('/chat/all', function(req, res){
    var userId = req.body.userId;
    var threads = {};
    console.log("working");
    console.log(typeof(req.body.userId));
    console.log(req.body.userId);
    console.log(typeof(userId) + " " + userId);
    for (let i = 0; i < parsed.Chats.length;i++){
        if (parsed.Chats[i].to == userId ||
            parsed.Chats[i].from == userId){
            var index = parsed.Chats[i].threadId;
            if (!threads[index]) {
                threads[index] = [];
            }
            threads[index].push(parsed.Chats[i]);
        }
    }
    console.log("about to sort!");
    for (var thread in threads){
        console.log("sorting");
        threads[thread].sort(function(a,b){
            return Date.parse(a.date) > Date.parse(b.date)} );
    }

    res.send(threads);
});

app.post('/users/all', function(req, res){
    res.send(parsed.Users);
});

app.post('/houses/all', function(req, res){
    let userId = req.body.userId;
    let housesArray = [];
    let i=0;
    for (i=0; i<parsed.Users.length; i++) {
        if (parsed.Users[i].id == userId) {
            let j=0;
            // console.log("USER LIVES IN: " + parsed.Users[i].housesDwelled);
            for (j=0; j<parsed.Users[i].housesDwelled.length; j++) {
                let k=0;
                for (k=0; k<parsed.Houses.length; k++) {
                    // console.log("HOUSE ID: " + parsed.Houses[k].id);
                    // console.log("DWELLED: " + parsed.Users[i].housesDwelled[j]);
                    if (parsed.Houses[k].id == parsed.Users[i].housesDwelled[j]) {
                        housesArray.push(parsed.Houses[k]);
                    }
                }
            }
            break;
        }
    }
    res.send(housesArray);
});

app.post("/chores/mine",function (req,res){
    let userId = req.body.userId;
    var chores = [];
    for (var i = 0; i < parsed.Chores.length;i++){
        for (var j = 0; j < parsed.Chores[i].participants.length;j++){
            if (userId == parsed.Chores[i].participants[j]){
                chores.push(parsed.Chores[i]);
            }
        }
    }
    res.send(chores);
});

//
// app.post("/houses",function(req, res){
//     // return the collection of houses from the db
//     res.send(housesCollection);
// });
//
// app.post("/chats/all",function(req, res){
//     let userId = req.body.userId;
//     // find all chats where user is either "from" or "to"
//     let threadsArrays = [];
//     for (i=0; i<parsed['Chats'].length; i++) {
//         if (parsed['Chats'][i].from == userId || parsed['Chats'][i].to == userID) {
//             threadsArray.push(parsed['Chats'][i]);
//         }
//     }
//     // parse them to create threads, and return the threads sorted descending by time
//     res.send(threadsArray);
// });
//
// app.post("/chores",function(req, res){
//     let userId = req.body.userId;
//     // find all chores where user is either "owner" or "participants"
//
//     // parse them to create a list and return the list sorted with earliest deadlines(datePlanned) first
//     res.send(choresList);
// });
//
// app.post("/notifications",function(req, res){
//     let userId = req.body.userId;
//     // parse them to create a list, and return the list sorted descending by time
//     let notifyList = [];
//     for (i=0; i<parsed['Notifications'].length; i++) {
//         if (parsed['Notifications'][i].for == userId) {
//             notifyList.push(parsed['Notifications'][i]);
//         }
//     }
//     res.send(notifyList);
// });