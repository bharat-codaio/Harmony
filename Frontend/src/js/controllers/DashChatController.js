/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('DashChatController', DashChatController);


    DashChatController.$inject = ['$state', '$rootScope', 'ServerService'];

    function DashChatController($state, $rootScope, ServerService){
        console.log("dash chat controller active");
        const vm = this;
        vm.mode = "LIST";

        if(!!$rootScope.selectedTab)
        {
          vm.selectedTab=$rootScope.selectedTab;
        }
        else{
          vm.selectedTab="CHAT";
        }

        vm.showDrawer = false;
        vm.showKabobDrop = false;
        vm.showNotifications = false;
        vm.addingHousemate = false;
        vm.addFriendEmail = "";
        vm.friends = {};
        vm.threadFriend = {};



        if(!$rootScope.userId){
            console.log("in branch");
            const user = JSON.parse(localStorage.getItem("Harmony-user"));
            if(!!user)
            {
                console.log("found user in LS");
                console.log(JSON.stringify(user, null,2));
                $rootScope.userId = user._id;
                $rootScope.user = user;
            }else{
                $rootScope.userId = null;
                $rootScope.user = null;
                $state.go("launch");
            }
        }else{
            console.log("somehow it is defined");
            console.log($rootScope.userId);
        }

        $rootScope.friends = {};
        vm.populateFriends = function(){
            ServerService
                .post('/users/get/friends',
                {userId : $rootScope.userId},
                    (friends) => {
                        $rootScope.friends = friends;
                        vm.friends = $rootScope.friends;
                    },
                    (payload) =>{
                        console.log("ERROR ACQUIRING FRIENDS");
                        console.log(JSON.stringify(payload, null, 2));
                    }

                );
        };
        vm.populateFriends();


        $rootScope.$on('ToggleChatMode', (msg, data) => {
            vm.threadFriend = data.friend;
        });


        $rootScope.user = {};
        $rootScope.user.friends = [];


        $rootScope.$on('ToggleChatMode', (data, msg)=>{
            vm.mode=msg.mode;
        });

        vm.toggleHamburger = toggleHamburger;
        vm.toggleKabob = toggleKabob;
        vm.toggleAlarm = toggleAlarm;
        vm.backToList = backToList;
        vm.switchTab = switchTab;
        vm.logOut = logOut;
        vm.toggleAddingHousemate = toggleAddingHousemate;
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

        function logOut(){
            localStorage.removeItem("Harmony-user");
            $rootScope.userId = null;
            $rootScope.user = {};
            $state.go('launch');
        }

        function toggleAddingHousemate(){
            vm.addingHousemate = !vm.addingHousemate;

            if(vm.showDrawer){
                vm.showDrawer = !vm.showDrawer;
            }
            // toastr.warning("Nothing Here Yet!");
        }

        function addHousemate(){
            ServerService
                .post("/users/add/friend", {
                        userId : $rootScope.userId,
                        friendEmail : vm.addFriendEmail
                    },
                    (payload) => {
                        console.log(JSON.stringify(payload));
                        if(!!payload.error){
                            toastr.error("Error : " + payload.error);
                        }
                        else if(!! payload.friend){
                          toastr.success("Your Friend accepted your invite! Scroll through the list to chat with them!");
                            $rootScope.friends.push(payload.friend);
                            vm.friends = $rootScope.friends;
                            console.log($rootScope.friends);

                        }
                        else {
                            console.log("no friends to show");
                        }

                        vm.addingHousemate = false;
                    },
                    (msg) => {
                        toastr.error("Server Error");
                        vm.addingHousemate = false;
                    }
                );
        }

    }
})();
