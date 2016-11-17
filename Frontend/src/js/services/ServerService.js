(() => {
    'use strict';

    angular
        .module('app')
        .factory('ServerService', ServerService);

    ServerService.$inject = ['$http'];

    function ServerService($http) {
        const SERVER_PREFIX = "http://localhost:8000";
        // const SERVER_PREFIX = "http://52.53.153.99";
        let self = this;

        self.post = post;


        function post(url, params, successCallback, failCallback) {
            $http.post(SERVER_PREFIX + url, params)
                .then(
                    response => {
                        successCallback(response.data);
                    }, response => {
                        failCallback(response.data);
                    }
                );
        }
        return self;
    }
})();

