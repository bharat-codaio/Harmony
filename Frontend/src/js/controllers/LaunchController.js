/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('LaunchController', LaunchController);

    LaunchController.$inject = ['$state', '$rootScope'];

    function LaunchController($state, $rootScope){

        const vm = this;

        $rootScope.userId = 0;

        vm.tryLogin = tryLogin;

        function tryLogin(){
            goToDash();
        }

        function goToDash(){
            $state.go('dash.chat');
        }

    }
})();