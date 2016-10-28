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
        this.selectedTab="CHAT";

        $rootScope.$on('ToggleChatMode', (data, msg)=>{
            vm.mode=msg.mode;
        });



        vm.toggleHamburger = toggleHamburger;
        vm.backToList = backToList;
        vm.switchTab = switchTab;

        function backToList(){
            vm.mode = "LIST";
        }
       function toggleHamburger(){
            console.log("Click Hamburger");
        }

        function switchTab(tab){
            console.log("Switch tab " + tab)
            vm.selectedTab = tab;
        }
    }
})();
