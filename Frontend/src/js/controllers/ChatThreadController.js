/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('ChatThreadController', ChatThreadController);


    function ChatThreadController(){
        const vm = this;

        vm.sendMessage = sendMessage;

        //TODO: Enable this for multiple messages
        vm.showNewMessage=false;

        vm.messageToSend = "";
        function sendMessage(){
            vm.showNewMessage = true;
        }
    }
})();
