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


    function ChoresController(){
        const vm = this;

        vm.showMyChores = true;//shows mine if true or others if false

        vm.toggleTab = toggleTab;
        vm.createChore = createChore;

        vm.myChores = {};
        vm.apartmentChores = {};


        function toggleTab(){
            vm.showMyChores = !vm.showMyChores;
        }

        function createChore(){
            toastr.warning("Create new chore cunt");
        }


        console.log("Chores Controller Active");
    }
})();
