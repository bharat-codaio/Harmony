/** Author: Anthony Altieri **/

(() => {
    'use strict';

    angular
        .module('app')
        .factory('DashInfoExchangeService', DashInfoExchangeService);

    DashInfoExchangeService.$inject = ['$http', '$state', '$rootScope', 'UserRoutes'];

    function DashInfoExchangeService($http, $state, $rootScope, UserRoutes) {
        let self = this;
        return self;
    }
})();

