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
        $state.go('dash.chat');
        toastr.success("Launch Controller Works with UI STATEEEEEEE. BoilerPlate Setup!!!")
    }
})();