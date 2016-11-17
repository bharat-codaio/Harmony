/**
 * Created by bharatbatra on 10/28/16.
 */
/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('ChoresController', ChoresController);

    ChoresController.$inject = ['ServerService', '$rootScope', '$scope'];

    function ChoresController(ServerService, $rootScope, $scope){
        const vm = this;

        vm.showMyChores = true;//shows mine if true or others if false
        vm.showOverlay = false;

        vm.toggleTab = toggleTab;
        vm.createChore = createChore;
        vm.hideOverlay = hideOverlay;
        vm.submitChore = submitChore;

        vm.myChoresToday = {};
        vm.myChoresTomorrow = {};
        vm.othersChoresCompleted = {};
        vm.othersChoresPastDue = {};
        vm.newChore = {};
        vm.assignToMe = false;
        vm.assigneeList = [];

        vm.friends = $rootScope.friends;
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

        vm.markComplete = function(chore){
            ServerService.post(
                "/chores/complete",
                {
                    choreId: chore._id,
                    userId: $rootScope.userId
                },
                (payload) => {
                    //success
                    if(!! payload.dateCompleted){
                        chore.checked = true;
                    }
                    toastr.success("Success! Completion toggled for chore : " + chore.name)

                },
                (payload) => {
                    //fail
                }


            )
        };

        vm.populateFriends();

        vm.callOut = function(chore){
          toastr.warning("Calling out " + chore.assigneeName);
        };

        vm.remind = function(chore){
          toastr.warning("Sent a reminder to " + chore.assigneeName + " to " + chore.name);
        };

        let obj = {userId : $rootScope.userId};

        console.log("gonna init");
         ServerService.post('/chores/get',
            obj,
             chores => { formatChores(chores);},
                 (err => {console.log(err)}));

        vm.apartmentChores = {};

        function toggleTab(){
            vm.showMyChores = !vm.showMyChores;
        }

        function createChore(){
            vm.showOverlay = true;
        }

        function hideOverlay(){
            vm.showOverlay = false;
        }

        function submitChore(){
            //TODO: Send chore to server
            vm.newChore.userId = $rootScope.userId;
            vm.newChore.participants = vm.assigneeList;
            vm.newChore.datePlanned = new Date(vm.newChore.choreDate).getTime();

            let time24 = vm.newChore.choreTime.split(":");

            if(validateHours(time24[0])&& validateMins(time24[1])){
                vm.newChore.datePlanned += time24[0]*60*60*1000 + time24[1]*60*60;

                console.log(vm.newChore.choreDate);
                console.log("BEFORE SUBMIT CHORE TIME");
                console.log(new Date(vm.newChore.choreDate).getTime());

                ServerService.post('/chores/create',
                  vm.newChore,
                  chores => {
                      formatChores(chores);
                      toastr.success("Created a new chore!");
                  },

                  err => {
                      toastr.error("Error creating Chore: " + err);
                      console.log(err)
                  });
            }
            else{
                toastr.error("Error creating Chore: Time Formatted incorrectly");
            }





            vm.hideOverlay();
        }

        vm.assignMe = function(){
            if(vm.assigneeList.includes($rootScope.userId)){
                vm.assigneeList.filter( id => id !== $rootScope.userId)
            }else {
                vm.assigneeList.push($rootScope.userId);
            }
        };


        vm.assign = function(friend){
            if(vm.assigneeList.includes(friend._id)){
                vm.assigneeList.filter( id => id !== friend._id)
            }else {
                vm.assigneeList.push(friend._id);
            }
        };

        function formatChores(chores){

            chores.filter(c => c.participants.includes($rootScope.userId));
            console.log("chores to format");
            console.log(JSON.stringify(chores));
            let eod = new Date();
            console.log(Date.parse(eod));
            eod.setHours(0,0,0,0);
            eod = Date.parse(eod);
            let eod_next = eod + ONE_DAY_MILLIS;
            //eod = Date.parse(new Date(eod)) + ONE_DAY_MILLIS;

            vm.myChoresToday = [];
            vm.myChoresTomorrow = [];
            vm.myChoresRemaining = [];
            vm.othersChoresCompleted = [];
            vm.othersChoresPastDue = [];

            chores.forEach( chore => {
                console.log(new Date(chore.datePlanned));
                console.log(Date.parse(eod)-(chore.datePlanned));

                if(!!chore.dateCompleted){
                    chore.checked = true;
                }else{
                    chore.checked = false;
                }


                let date = new Date(chore.datePlanned);
                //console.log(date);
                chore.time = formatAMPM(date);
                chore.date = getDate(date);
                if(chore.owner===$rootScope.userId){
                    if(eod_next - date >= 0 && eod_next - date <= ONE_DAY_MILLIS){
                        vm.myChoresToday.push(chore);
                    }
                    else if( eod_next - date < 0 && date - eod_next <= ONE_DAY_MILLIS ) {
                        vm.myChoresTomorrow.push(chore);
                    }
                    else{
                        vm.myChoresRemaining.push(chore);
                    }
                }else{
                    chore.assigneeName = chore.userId;//TODO: match this to correct name
                    if(Date.parse(new Date())-chore.datePlanned>=0 && !chore.dateCompleted){
                        vm.othersChoresPastDue.push(chore);
                    }else{
                        vm.othersChoresCompleted.push(chore);
                    }
                }


            });
            vm.myChores = chores; console.log("Chores are here"); console.log(chores);
        }


        console.log("Chores Controller Active");
    }
})();
