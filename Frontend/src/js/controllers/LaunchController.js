/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('LaunchController', LaunchController);

    LaunchController.$inject = ['$state'];

    function LaunchController($state){

        const vm = this;

        vm.tryLogin = tryLogin;

        function tryLogin(){
            goToDash();
        }

        function goToDash(){
            $state.go('dash.chat');
        }

    }
})();