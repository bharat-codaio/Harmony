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
            vm.newChore.owner = $rootScope.userId;
            vm.newChore.participants = [$rootScope.userId];
            vm.newChore.dateCreated = Date.parse(new Date());
            vm.newChore.datePlanned = new Date(vm.newChore.choreDate).getTime();

            let time24 = vm.newChore.choreTime.split(":");

            vm.newChore.datePlanned += time24[0]*60*60*1000 + time24[1]*60*60;

            console.log(vm.newChore.choreDate);
            console.log(new Date(vm.newChore.choreDate).getTime());

            ServerService.post('/chores/add',
                {chore: vm.newChore},
                chores => {formatChores(chores)},
                (err => {console.log(err)}));

            toastr.success("Created a new chore!");
            vm.hideOverlay();
        }

        vm.assignMe = function(){
            console.log("Toggle Assign me");
            vm.assignToMe = !vm.assignToMe;
        };

        function formatChores(chores){
            let eod = new Date();
            console.log(Date.parse(eod));
            eod.setHours(0,0,0,0);
            eod = Date.parse(eod);
            let eod_next = eod + ONE_DAY_MILLIS;
            //eod = Date.parse(new Date(eod)) + ONE_DAY_MILLIS;

            vm.myChoresToday = [];
            vm.myChoresTomorrow = [];
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
                if(chore.owner===$rootScope.userId){
                    if(eod_next - date >= 0 && eod_next - date <= ONE_DAY_MILLIS){
                        vm.myChoresToday.push(chore);
                    }
                    else if( eod_next - date < 0 && date - eod_next <= ONE_DAY_MILLIS ) {
                        vm.myChoresTomorrow.push(chore);
                    }
                }else{
                    chore.assigneeName = "Jimmy";
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
