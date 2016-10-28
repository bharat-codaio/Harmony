/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('DashChatController', DashChatController);


    DashChatController.$inject = ['$state', '$rootScope'];

    function DashChatController($state, $rootScope){
        console.log("dash chat controller active");
        const vm = this;
        this.mode = "LIST";

        $rootScope.$on('ToggleChatMode', (data, msg)=>{
            vm.mode=msg.mode;
        })
    }
})();
