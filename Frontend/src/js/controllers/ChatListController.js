/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('ChatListController', ChatListController);

    ChatListController.$inject = ['$state'];

    function ChatListController($state){
        console.log("chat List controller active")
    }
})();
