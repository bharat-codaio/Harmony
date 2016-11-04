/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('ChatListController', ChatListController);

    ChatListController.$inject = ['$state', '$rootScope'];

    function ChatListController($state, $rootScope){
        const vm = this;
        console.log("chat List controller active");

        vm.threadSelected = threadSelected;
        vm.addThread = addThread;

        function threadSelected(){
            console.log("Thread Selected!");
            $rootScope.$broadcast('ToggleChatMode', {mode: 'THREAD'});
        }

        function addThread(){
            toastr.warning("Add Chat functionality not available yet")
        }

    }
})();
