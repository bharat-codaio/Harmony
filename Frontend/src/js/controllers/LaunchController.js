/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('LaunchController', LaunchController);

    LaunchController.$inject = ['$state', '$rootScope', 'ServerService'];

    function LaunchController($state, $rootScope, ServerService){

        const vm = this;
        vm.input = {};

        const user = JSON.parse(localStorage.getItem("Harmony-user"));
        if(!!user)
        {
            $rootScope.userId = user._id;
            $rootScope.user = user;
            vm.goToDash();
        }else{
            $rootScope.userId = null;
        }

        vm.tryLogin = tryLogin;
        vm.toggleLaunchMode = toggleLaunchMode;
        vm.modeLogin = true;
        vm.trySignUp = trySignUp;
        vm.goToDash = goToDash;

        function tryLogin(){
            ServerService
                .post('/users/login',
                    {email : vm.input.email, password : vm.input.password},
                    (user)=>{
                        if(!! user._id){
                            localStorage.setItem("Harmony-user", JSON.stringify(user));
                            $rootScope.userId = user._id;
                            console.log(user._id);
                            vm.goToDash();
                        }
                        else{
                            toastr.error("Incorrect Login Details");
                        }



                    },
                    (msg)=>{toastr.error("Server Error")});
            // goToDash();
        }

        function trySignUp(){
            ServerService
                .post('/users/create',
                        {email : vm.input.email,
                        password : vm.input.password,
                        firstname : vm.input.firstname,
                        lastname : vm.input.lastname},
                    (user)=>{
                        console.log("sign up success");

                        if(!! user._id){
                            localStorage.setItem("Harmony-user", JSON.stringify(user));
                            $rootScope.userId = user._id;
                            console.log(user._id);
                            vm.goToDash();
                        }
                        else{
                            toastr.error("Error: Email Already In Use");
                        }
                    },
                    (msg)=>{toastr.error("Error: Email already in use")});

            // goToDash();
        }

        function toggleLaunchMode(){
            vm.modeLogin = !vm.modeLogin;
        }


        function goToDash(){
            $state.go('dash.chat');
        }

    }
})();