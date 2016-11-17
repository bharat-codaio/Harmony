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
    .controller('SuccessController', SuccessController);

  SuccessController.$inject = ['$state', '$rootScope', 'ServerService'];

  function SuccessController($state, $rootScope, ServerService){

    const vm = this;

    console.log("This is success controller");
    vm.goBack = goBack;

    $rootScope.selectedTab = "CHORES";
    function goBack(){
      $state.go('dash.chat');
    }

  }
})();