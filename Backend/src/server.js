/**
 * Created by bharatbatra on 10/27/16.
 * Heavily modified by Vladimir Klimkiv 11/09/2016
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

//Database stuff
var mongoose = require('mongoose');

//TODO: Connect to the server, this needs to be changed
var mongodburl = 'mongodb://localhost/Harmony';
mongoose.connect(mongodburl);
var db = mongoose.connection;
var usersSchema,
    Users,
    housesSchema,
    Houses,
    notificationsSchema,
    Notifications,
    choresSchema,
    Chores,
    chatsSchema,
    Chats,
    threadsSchema,
    Threads;

db.on('error', console.error);
db.once('open', function(){
    /*  TODO: finish the schemas and models
     Add new fields as the need arises
     */
    console.log("Building Schemas");
    usersSchema = new mongoose.Schema({
        nickname: String,
        firstname: String,
        lastname: String,
        email: {type : String, unique : true },
        password: String,
        photo: String,
        housesDwelled: [String],
        friends: [String]
    });

    Users = mongoose.model('Users', usersSchema);

    housesSchema = new mongoose.Schema({
        nickname: String,
        address: String, //TODO: turn into an Address object
        photo: String,
        dwellers: [String],
        owner: [String]
    });

    Houses = mongoose.model('Houses', housesSchema);

    //TODO: for notifications, just delete them when the user has seen them?
    notificationsSchema = new mongoose.Schema({
        for: String,
        type: String,
        name: String,
        description: String,
        date: String,
        status: String //TODO: change to an enum type? This can be easy to change later
    });

    Notifications = mongoose.model('Notifications',notificationsSchema);

    choresSchema = new mongoose.Schema({
        owner: String,
        name: String,
        dateCreated: String,
        dateCompleted: String,
        datePlanned: Number,
        negativeFeedbackList: [String], //TODO: not sure what goes in here
        description: String,
        participants: [String],
        frequency: String, //TODO: change to enum
        scheduling: String, //TODO: change to enum
        current: [String]
    });
    Chores = mongoose.model('Chores',choresSchema);

    chatsSchema = new mongoose.Schema({
        date: String,
        from: String,
        message: String
    });

    Chats = mongoose.model('Chats', chatsSchema);

    threadsSchema = new mongoose.Schema({
        participants: [String],
        chats: [String]
    });

    Threads = mongoose.model('Threads', threadsSchema);
    console.log("Finished building schemas!");
});

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

/***********************************
 * Users Endpoints
 **********************************/


/******
 *   Output: [] or array of Users
 */
app.post('/users/all', function(req, res){

    Users.find({}, function(err,users){
        if (err) throw err;
        res.send(users);
    });
});

/******
 *   Output: [] or array of Users
 */
app.post('/users/login', function(req, res){

    console.log("Attempt login");
    console.log(JSON.stringify(req.body));
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    Users.find({email: userEmail, password: userPassword}, function(err,users){
        if (err) throw err;
        if(!!users[0]){
            console.log(JSON.stringify(users[0]));
            res.send(users[0]);
        }
        else{
            console.log("no user found");
            res.send(null);
        }


    });
});


/******
 *   Output: [] or array of Users
 */
app.post('/users/create', function(req, res){
    let userNickname = req.body.nickname;
    let userFirstname = req.body.firstname;
    let userLastname = req.body.lastname;
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    let userPhoto = req.body.photo;

    var newUser = Users({
        nickname : userNickname,
        firstname: userFirstname,
        lastname: userLastname,
        email: userEmail,
        password: userPassword,
        photo: userPhoto,
        housesDwelled : [],
        friends: []
    });

    try {
        var promise = newUser.save(function (err) {
            if (err) {
                console.log(err);
                res.send({error: 500});
            }
            else {
                console.log("Created new user");
                res.send(newUser);
            }


        });
    }
    catch(err){
        console.log(err);
        res.send({error: 500});
    }
});

/******
 *   Output: [] or array of Users
 */
app.post('/users/add/friend',function(req,res){
    let friendEmail = req.body.friendEmail;
    let userId = req.body.userId;

    if (!!userId && !!friendEmail) {

        Users.findOne({_id: userId}, function (err, user) {
            if (err) throw err;
            if (user) {

                Users.find({email: friendEmail}, function (err, friends) {
                    if (err) throw err;
                    if (!!friends[0]){

                        let friend = friends[0]
                        var nodups = true;
                        console.log(user.friends);
                        if(!!user.friends){
                            for (var i = 0; i < user.friends.length; i++){
                                if (user.friends[i] == friend._id){
                                    nodups = false;
                                }
                            }
                        }


                        if (nodups){
                            user.friends.push(friend._id);
                        }

                        nodups = true;

                        if(!!friend.friends){
                            for (var i = 0; i < friend.friends.length; i++){
                                if (friend.friends[i] == user._id){
                                    nodups = false;
                                }
                            }
                        }else{

                        }


                        if (nodups) {
                            friend.friends.push(user._id);
                            let promise = user.save(function(err){
                                if (err) throw err;

                                let promise = friend.save(function(err){
                                    if (err) throw err;

                                    var tosend = [];

                                    tosend.push(friend);
                                    tosend.push(user);
                                    res.send({user : user, friend : friend});
                                });
                            });
                        }
                        else{
                            res.send({error : "User already in Household"});
                        }



                    } else {
                        res.send({error: "Friend Not Found"});
                    }
                });
            } else {
                res.send({error: "User Not Found"});
            }
        });
    } else {
        res.send({error: "Incorrect Request", code: 500});
    }
});

/******
 *   Output: [] or array of Users
 */
app.post('/users/remove/friend',function(req,res){
    let friendId = req.body.friendId;
    let userId = req.body.userId;

    if (userId && friendId) {

        Users.findOne({_id: userId}, function (err, user) {
            if (err) throw err;
            if (user) {
                Users.findOne({_id: friendId}, function (err, friend) {
                    if (err) throw err;
                    if (friend){

                        var oldfriends = [];
                        var oldfriend;

                        while (user.friends.length > 0){
                            oldfriend = user.friends.pop();
                            if (oldfriend != friend._id){
                                oldfriends.push(oldfriend);
                            }
                        }

                        user.friends = oldfriends;
                        oldfriends = [];

                        while (friend.friends.length > 0){
                            oldfriend = friend.friends.pop();
                            if (oldfriend != user._id){
                                oldfriends.push(oldfriend);
                            }
                        }

                        user.friends = oldfriends;


                        let promise = user.save(function(err){
                            if (err) throw err;

                            let promise = friend.save(function(err){
                                if (err) throw err;

                                var tosend = [];

                                tosend.push(friend);
                                tosend.push(user);
                                res.send(tosend);
                            });
                        });
                    } else {
                        res.send(user);
                    }
                });
            } else {
                res.send([]);
            }
        });
    } else {
        res.send([]);
    }
});

/******
 *   Output: [] or array of Users
 */
app.post('/users/get/friends', function(req,res){
    let userId = req.body.userId;

    if (userId) {
        Users.find({friends: {$elemMatch: {$eq: userId}}}, function(err, friends){
            if (err) throw err;

            if(!!friends){
                res.send(friends);
            }
            else{
                res.send([])
            }


        });
    } else {
        res.send({error : "Incorrect request", code: 500});
    }
});


/******
 *   Output: [] or array of Users
 */
app.post('/users/get', function(req, res){
    let userId = req.body.userId;

    Users.find({_id: userId}, function(err, user){
        if (err) throw err;

        res.send(user);
    })
});

/******
 *   Output: [] or array of Houses
 */
app.post('/users/get/house', function(req,res){
    let userId = req.body.userId;

    Users.findOne({_id: userId}, function(err, user){
        if (err) throw err;
        if (user){
            if (user.housesDwelled.length > 0){
                Houses.find({_id: {$in:  user.housesDwelled}},
                    function(err, houses){
                        if (err) throw err;

                        res.send(houses);
                    });
            } else {
                res.send([]);
            }
        } else {
            res.send([]);
        }

    });

});
/***********************************
 * Chores Endpoints
 **********************************/

/******
 *   Helper function: TODO: implement scheduling
 */
var choreSchedule = function(parts, sched){
    var next = null;
    if (sched == "random"){
        next = parts.pop();
    } else if (sched == "round_robin"){
        next = parts.pop();
    } else {
        next = parts.pop();
    }
    parts.push(next);
    return [next];
};

/******
 *   Output: [] or array of Chores
 *   get all chores for this user
 */
app.post("/chores/get",function(req, res){
    let userId = req.body.userId;
    Chores.find({participants: {$elemMatch: {$eq: userId } }},
        function(err,chores){
            if (err) throw err;

            res.send(chores);
        });
});


/******
 *   Output: [] or array of Chores
 *   create a new chore
 */
app.post("/chores/create",function(req,res){
    let choreOwner  = req.body.userId;
    let choreName   = req.body.name;
    let choreDesc   = req.body.description;
    let choreParts  = req.body.participants;
    let choreFreq   = req.body.frequency;
    let choreSched  = req.body.scheduling;

    var newChore = Chores({
        owner: choreOwner,
        name: choreName,
        dateCreated: new Date(),
        dateCompleted: null,
        datePlanned: Date.now(),
        negativeFeedbackList: [],
        description: choreDesc,
        participants: choreParts,
        frequency: choreFreq,
        scheduling: choreSched,
        current: choreSchedule(choreParts, choreSched)
    });

    var promise = newChore.save(function(err){
        if (err) throw err;
        Chores.find({participants: {$elemMatch: {$eq: choreOwner}}},
            function(err,chores){
                if (err) throw err;
                res.send(chores);
            });

    });
});


/******
 *   Output: [] or array of Chores
 */
app.post("/chores/complete", function(req,res){
    let choreId = req.body.choreId;
    let userId  = req.body.userId;

    Chores.findOne({_id: choreId},function(err,chore){
        if (err) throw err;

        chore.dateCompleted = new Date();
        if (chore.frequency != "once") {
            chore.current = choreSchedule(chore.participants, chore.scheduling);
        }

        var promise = chore.save(function(err){
            if (err) throw err;
            Chores.find({participants: {$elemMatch: {$eq: userId}}},
                function(err,chores){
                    if (err) throw err;
                    res.send(chore);
                });
        });
    });
});


/******
 *   Output: Notification
 */
app.post("/chores/remind",function(req,res){
    let choreId = req.body.choreId;
    let userId = req.body.userId;

    Chores.findOne({_id: choreId}, function(err,chore){
        if (err) throw err;
        Users.findOne({_id: userId}, function(err,user){
            if (err) throw err;

            var newNotify = Notifications({
                for: user._id,
                type: "chore",
                name: "Reminder: " + chore.name,
                description: "Hey, " + user.firstname + " you have an unfinished chore: " + chore.name,
                date: (new Date()),
                status: "unread"
            });

            newNotify.save(function(err){
                if (err) throw err;

                res.send(newNotify);
            });
        });
    });
});


/******
 *   Output: Notification
 */
app.post("/chores/callOut",function(req,res){
    let choreId  = req.body.choreId;
    let userId   = req.body.userId;
    let friendId = req.body.friendId;

    Chores.findOne({_id: choreId}, function(err,chore){
        if (err) throw err;
        Users.findOne({_id: userId}, function(err,user){
            if (err) throw err;
            Users.findOne({_id: friendId}, function(err,friend){
                if (err) throw err;

                var newNotify = Notifications({
                    for: friend._id,
                    type: "callout",
                    name: "Uh-oh! " + friend.firstname + ", chore not complete!",
                    description: user.firstname + " thinks you need to complete " + chore.name,
                    date: new Date(),
                    status: "unread"
                });

                var promise = newNotify.save(function(err){
                    if (err) throw err;

                    res.send(newNotify);
                });
            });
        });
    });
});


/******
 *   Output: [] or array of Chores
 */
app.post("/chores/delete",function(req,res){
    let choreId = req.body.choreId;
    let userId  = req.body.userId;

    Chores.findOneAndRemove({_id: choreId}, function(err,chore){
        if (err) throw err;
        Chores.find({participants: {$elemMatch: {$eq: userId}}},
            function(err, chores){
                if (err) throw err;
                res.send(chores);
            });
    });
});

/***********************************
 * Chats Endpoints
 **********************************/


/******
 *   Output: Object
 *   {
 *      thread: Threads,
 *      chats: Chats
 *   }
 */
app.post("/threads/send/message",function(req,res){
    let threadId = req.body.threadId;
    let userParts = req.body.participants;
    let fromUser = req.body.from;
    let message = req.body.message;

    var newChat = Chats({
        date: new Date(),
        from: fromUser,
        message: message
    });

    if (threadId) {
        console.log(threadId);
        Threads.findOne({_id: threadId}, function (err, thread) {
            if (err) throw err;
            if (!!thread) {
                console.log("Found a thread");
                thread.chats.push(newChat._id);
                let promise = newChat.save(function (err) {
                    if (err) throw err;
                    let promise = thread.save(function (err) {
                        if (err) throw err;
                        Chats.find({_id: {$in: thread.chats}}, function (err, chats) {
                            if (err) throw err;

                            var tosend = {
                                thread: thread,
                                chats: chats
                            }

                            res.send(tosend);
                        });

                    });
                });
            } else {
                createNewThread(threadId, userParts, newChat,res);
            }
        });
    } else {
        createNewThread(threadId, userParts,newChat,res);
    }
});


/******
 * Helper function
 */
var createNewThread = function(threadId, userParts,newChat,res){
    var newThread = Threads({
        _id: threadId,
        participants: userParts,
        chats: []
    });
    console.log("Creating new thread: " + userParts);
    newThread.chats.push(newChat._id);

    let promise = newChat.save(function (err) {
        if (err) throw err;
        let promise = newThread.save(function (err) {
            if (err) throw err;

            var tosend = {
                thread: newThread,
                chats: newChat
            }

            res.send(tosend);
        });
    });
}


/******
 *   Output: [] or array of Threads
 */
app.post("/threads/get",function(req,res){
    let userId     = req.body.userId;

    Threads.find({participants: {$elemMatch: {$eq: userId}}},
        function(err, threads){
            if (err) throw err;

            if(!!threads){

            }

            res.send(threads);
        });

});

/******
 *   Output: [] or Object
 *   {
 *      thread: Threads,
 *      chats: Chats
 *   }
 */
app.post("/threads/get/chat",function(req,res){
    let threadId = req.body.threadId;

    Threads.findOne({_id: threadId}, function(err,thread){
        if (err) throw err;
        if (thread){
            Chats.find({_id: {$in: thread.chats}}, function(err, chats){
                if (err) throw err;

                var tosend = {
                    thread: thread,
                    chats: chats
                };

                res.send(tosend);
            });
        } else {
            res.send([]);
        }
    });
});

/***********************************
 * Notifications Endpoints
 **********************************/
/******
 *   Output: [] or array of Notifications
 */
app.post("/notifications/get",function(req,res){
    let userId = req.body.userId;

    Notifications.find({for: userId}, function(err, notifc){
        if (err) throw err;

        res.send(notifc);
    });

});

/******
 *   Output: Notifications
 */
app.post("/notifications/read",function(req,res){
    let notificationId = req.body.notificationId;
    let userId = req.body.userId;

    Notifications.findOne({_id: notificationId, for: userId},
        function(err,notification){
            if (err) throw err;
            notification.status = "read";
            notification.save(function(err){
                if (err) throw err;
                res.send(notification);
            });
        });
});

/******
 *   Output: Notifications
 */
app.post("/notifications/create", function(req,res){
    let notiFor = req.body.for;
    let notiName  = req.body.name;
    let notiDesc  = req.body.description;
    let notiType = req.body.type;

    var newNotific = Notifications({
        for: notiFor,
        type: notiType,
        name: notiName,
        description: notiDesc,
        date: new Date(),
        status: "unread"
    });

    var promise = newNotific.save(function(err){
        if (err) throw err;

        res.send(newNotific);
    });

});

/******
 *   Output: [] or array of Notifications
 */
app.post("/notification/delete", function(req,res){
    let notiId = req.body.notificationId;
    let userId = req.body.userId;

    Notifications.findOneAndRemove({_id: notiId}, function(err,notification){
        if (err) throw err;
        Notifications.find({for: userId}, function(err,notifs){
            if (err) throw err;

            res.send(notifs);
        });
    });
});

/***********************************
 * Houses Endpoints
 **********************************/
/******
 *   Output: [] or Object
 *   {
 *      houses: Houses,
 *      users: Users
 *   }
 */
app.post("/houses/create",function(req,res){
    let houseNickname = req.body.nickname;
    let houseAddress  = req.body.address;
    let housePhoto    = req.body.photo;
    let userId        = req.body.userId;

    Users.findOne({_id: userId}, function(err,user){
        if (err) throw err;
        if (user){
            var newHouse = Houses({
                nickname: houseNickname,
                address: houseAddress,
                photo: housePhoto,
                dwellers: [user._id],
                owner: [user._id]
            });

            user.housesDwelled.push(newHouse._id);

            user.save(function(err){
                if (err) throw err;

                newHouse.save(function(err){
                    if (err) throw err;

                    var tosend = {
                        houses: newHouse,
                        users: user
                    };

                    res.send(tosend);
                });
            });

        } else {
            res.send([]);
        }
    });
});

/******
 *   Output: [] or array of Houses
 *   gets houses for a given user
 */
app.post("/houses/get",function(req,res){
    let userId = req.body.userId;

    Houses.find({dwellers: {$elemMatch: {$eq: userId}}}, function (err, houses) {
        if (err) throw err;

        res.send(houses);
    });

});

/******
 *   Output: [] or array of Houses
 *   gets all houses
 */
app.post("/houses/all",function(req,res){

    Houses.find({}, function (err, houses) {
        if (err) throw err;

        res.send(houses);
    });

});
/******
 *   Output: [] or array of Users
 *   gets all users for a given house
 */
app.post("/houses/get/user",function(req,res){
    let houseId = req.body.houseId;

    Users.find({housesDwelled: {$elemMatch: {$eq: houseId}}}, function (err, users) {
        if (err) throw err;

        res.send(users);
    });

});

/******
 *   Output: [] or Object
 *   {
 *      houses: Houses,
 *      users: Users
 *   }
 *
 *   adds friend to house, returns friend and house
 */
app.post("/houses/add/friend",function(req,res){
    let friendId = req.body.friendId;
    let houseId = req.body.houseId;
    let userId = req.body.userId;

    if (friendId && houseId && userId) {
        Houses.findOne({_id: houseId, owner: {$elemMatch: {$eq: userId}}}, function (err, house) {
            if (err) throw err;

            if (house) {

                var nodups = true;

                for (var i = 0; i < house.dwellers.length; i++){
                    if (house.dwellers[i] == friendId){
                        nodups = false;
                    }
                }
                if (nodups) {
                    house.dwellers.push(friendId);
                }

                let promise = house.save(function (err) {
                    if (err) throw err;
                    Users.findOne({_id: friendId}, function (err, friend) {
                        if (err) throw err;

                        if (friend) {

                            var nodups = true;
                            for (var i = 0; i < friend.housesDwelled.length; i++){
                                if (friend.housesDwelled[i] == house._id){
                                    nodups = false;
                                }
                            }
                            if (nodups) {
                                friend.housesDwelled.push(house._id);
                            }

                            let promise = friend.save(function(err){
                                if (err) throw err;

                                var tosend = {
                                    houses: [],
                                    users: []
                                };

                                tosend.users.push(friend);
                                tosend.houses.push(house);
                                res.send(tosend);
                            });
                        } else {
                            res.send(house);
                        }
                    });
                });
            } else {
                res.send([]);
            }
        });
    } else {
        res.send([]);
    }
});

/******
 *   Output: [] or Object
 *   {
 *      houses: Houses,
 *      users: Users
 *   }
 *
 *   removes friend from house returns friend and house
 */
app.post("/houses/remove/friend",function(req,res){
    let friendId = req.body.friendId;
    let houseId  = req.body.houseId;
    let userId   = req.body.userId;

    if (friendId && houseId && userId) {
        Users.findOne({_id: friendId}, function (err, friend) {
            if (err) throw err;

            var houses = [];
            var curhouse;

            while (friend.housesDwelled.length > 0) {
                curhouse = friend.housesDwelled.pop();
                if (curhouse != houseId) {
                    houses.push(house);
                }
            }

            friend.housesDwelled = houses;

            var promise = friend.save(function (err) {
                if (err) throw err;

                Houses.findOne({_id: houseId, owner: {$elemMatch: {$eq: userId}}}, function (err, house) {
                    if (err) throw err;
                    if (house) {
                        var dwellers = [];
                        var dweller;

                        while (house.dwellers.length > 0) {
                            dweller = house.dwellers.pop();
                            if (dweller != friend._id) {
                                dwellers.push(dweller);
                            }
                        }

                        house.dwellers = dwellers;

                        var promise = house.save(function (err) {
                            if (err) throw err;

                            var tosend = {
                                houses: [],
                                users: []
                            };

                            tosend.users.push(friend);
                            tosend.houses.push(house);
                            res.send(tosend);
                        });
                    } else {
                        res.send(friend);
                    }
                });
            });
        });
    } else {
        res.send([]);
    }
});




/*
 Retrieve the user's chore list
 */

//
// app.post("/chats/get",function(req,res){
//     let userId = req.body.userId;
//     var chores = [];
//     for (var i = 0; i < parsed.Chores.length;i++){
//         for (var j = 0; j < parsed.Chores[i].participants.length;j++){
//             if (userId == parsed.Chores[i].participants[j]){
//                 chores.push(parsed.Chores[i]);
//             }
//         }
//     }
//     res.send(chores);
// });
//
// app.post("/houses/get",function(req,res){
//     let userId = req.body.userId;
//     let housesArray = [];
//     let i=0;
//     for (i=0; i<parsed.Users.length; i++) {
//         if (parsed.Users[i].id == userId) {
//             let j=0;
//             // console.log("USER LIVES IN: " + parsed.Users[i].housesDwelled);
//             for (j=0; j<parsed.Users[i].housesDwelled.length; j++) {
//                 let k=0;
//                 for (k=0; k<parsed.Houses.length; k++) {
//                     // console.log("HOUSE ID: " + parsed.Houses[k].id);
//                     // console.log("DWELLED: " + parsed.Users[i].housesDwelled[j]);
//                     if (parsed.Houses[k].id == parsed.Users[i].housesDwelled[j]) {
//                         housesArray.push(parsed.Houses[k]);
//                     }
//                 }
//             }
//             break;
//         }
//     }
//     res.send(housesArray);
//
// });
//
// app.post('/chat/all', function(req, res){
//     var userId = req.body.userId;
//     var threads = {};
//     for (let i = 0; i < parsed.Chats.length;i++){
//         if (parsed.Chats[i].to == userId ||
//             parsed.Chats[i].from == userId){
//             var index = parsed.Chats[i].threadId;
//             if (!threads[index]) {
//                 threads[index] = [];
//             }
//             threads[index].push(parsed.Chats[i]);
//         }
//     }
//     for (var thread in threads){
//         threads[thread].sort(function(a,b){
//         return Date.parse(a.date) > Date.parse(b.date)} );
//     }
//
//     res.send(threads);
// });
//
// app.post('/users/all', function(req, res){
//     res.send(parsed.Users);
// });
//
//
//
//
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