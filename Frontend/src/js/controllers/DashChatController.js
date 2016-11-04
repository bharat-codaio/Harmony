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
        vm.mode = "LIST";
        vm.selectedTab="CHAT";
        vm.showDrawer = false;
        vm.showKabobDrop = false;
        vm.showNotifications = false;

        $rootScope.$on('ToggleChatMode', (data, msg)=>{
            vm.mode=msg.mode;
        });

        vm.toggleHamburger = toggleHamburger;
        vm.toggleKabob = toggleKabob;
        vm.toggleAlarm = toggleAlarm;
        vm.backToList = backToList;
        vm.switchTab = switchTab;
        vm.goToSettings = goToSettings;
        vm.addHousemate = addHousemate;

        function backToList(){
            vm.mode = "LIST";
        }
       function toggleHamburger(){
           vm.showDrawer = !vm.showDrawer;
            console.log("Show Drawer " +  vm.showDrawer);
        }

        function toggleKabob(){
           vm.showKabobDrop = !vm.showKabobDrop;
            console.log("Show Kabob Drop " +  vm.showKabobDrop);
        }

        function toggleAlarm() {
            //vm.showNotifications = !vm.showNotifications;
            toastr.warning("No New Notifications!");
            console.log("Show Notifications " +  vm.showNotifications);
        }

        function switchTab(tab){
            console.log("Switch tab " + tab);
            vm.selectedTab = tab;
        }

        function goToSettings(){
            toastr.warning("Settings functionality coming soon!")
        }

        function addHousemate(){
            toastr.warning("Nothing Here Yet!");
        }
    }
})();
