/**
 * Created by bharatbatra on 11/17/16.
 */
/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
  'use strict';

  angular
    .module('app')
    .controller('FailureController', FailureController);

  FailureController.$inject = ['$state', '$rootScope', 'ServerService'];

  function FailureController($state, $rootScope, ServerService){

    const vm = this;

    console.log("This is Failure controller");
    vm.goBack = goBack;

    $rootScope.selectedTab = "CHORES";
    function goBack(){
      $state.go('dash.chat');
    }

  }
})();