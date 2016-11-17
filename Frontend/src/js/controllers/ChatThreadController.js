/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('ChatThreadController', ChatThreadController);

    ChatThreadController.$inject = ['$state', '$rootScope', 'ServerService'];

    function ChatThreadController($state, $rootScope, ServerService){
        const vm = this;

        //TODO:Make this generic so threadID is more robust and dynamic and can
        //Support real time system
        //Currently threadID is assigned by the TO: Id
        vm.sendMessage = sendMessage;
        vm.friend = {};
        vm.friend.firstname = "hello";
        vm.friend.lastname = "world";
        vm.chats = {};

        //TODO: Enable this for multiple messages
        vm.showNewMessage=false;


        vm.messageToSend = "";
        function sendMessage(){
            ServerService
                .post('/threads/send/message',
                    {
                        threadId : vm.friend._id,
                        participants : [$rootScope.userId, vm.friend._id],
                        from : $rootScope.userId,
                        message : vm.messageToSend
                    },
                    (payload) => {
                        //success
                        console.log("PAYLOAD");
                        console.log(JSON.stringify(payload));

                        console.log("VM CHATS");
                        vm.messageToSend="";
                        vm.chats=payload.chats;
                        formatChats();
                        console.log(JSON.stringify(vm.chats, null, 2));

                    },
                    (payload) => {
                        //fail
                    }

                    )
        }

        function formatChats(){
            console.log("Chats to format");
            console.log(JSON.stringify(vm.chats, null, 2));
            if(!!vm.chats){
                if (!vm.chats.length){
                   vm.chats = [vm.chats];
                }

                vm.chats.forEach( c => {
                    if(c.from===$rootScope.userId){
                        c.senderName = "Me";
                    }else{
                        //TODO: Make this generic for multiple users
                        c.senderName = vm.friend.firstname;


                    }
                    // console.log(c.date);
                    // console.log(formatAMPM(Date.parse(c.date)));
                    c.time = formatAMPM(new Date(Date.parse(c.date)));
                });


            }

        }

        function getThreadChats(){
            ServerService
                .post('/threads/get/chat',
                    {
                        threadId : vm.friend._id
                    },
                    (payload) => {
                        //success
                        vm.chats=payload.chats;
                        formatChats();
                        console.log(JSON.stringify(payload));
                    },
                    (payload) => {
                        //fail
                    });
        }

        $rootScope.$on('ToggleChatMode', (msg, data) => {
            vm.chats = [];//TODO: get data from server regaridng the chats
            vm.friend = data.friend;
            getThreadChats();
        })
    }
})();
