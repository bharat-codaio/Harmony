/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngMaterial', 'ngMessages'])
        .run(($http) =>{
            $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            // Toast Options
            toastr.options.positionClass = 'toast-bottom-full-width';
            toastr.options.showDuration = 500;
            toastr.options.hideDuration = 500;
            toastr.options.timeOut = 3000;

            console.log("This is app run");

        })
        .config(($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider)=>{
            $httpProvider.defaults.withCredentials = true;

            console.log("This is app config");
            const launch = {
                name: 'launch',
                url: '/launch',
                templateUrl: '/static/templates/launch.html',
                controller: 'LaunchController'
            };

            const dash = {
                name: 'dash',
                url: '/dash',
                abstract: true,
                templateUrl: '/static/templates/dash.html'
            };

            const dashChat = {
                name: 'dash.chat',
                parent: 'dash',//TODO: Enable this when we add a main dash
                url: '/chat',
                params: {
                    data: null
                },
                views: {
                    '': {
                        templateUrl: '/static/templates/dash.chat.html',
                        controller: 'DashChatController',
                        controllerAs: 'dash',
                    },
                    'thread@dash.chat': {
                        templateUrl: '/static/templates/chat.thread.html',
                        controller: 'ChatThreadController',
                        controllerAs: 'thread'
                    },
                    'chatList@dash.chat': {
                        templateUrl: '/static/templates/chat.list.html',
                        controller: 'ChatListController',
                        controllerAs: 'chatList'
                    }
                }
            };


            $stateProvider
                .state(dash)
                .state(launch)
                .state(dashChat);

            $urlRouterProvider.otherwise('/dash/chat');
            $locationProvider.html5Mode(true);
        });
})();