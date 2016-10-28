/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('DashChatController', DashChatController);


    function DashChatController(){
        console.log("dash chat controller active");
        const vm = this;
        this.mode = "LIST";
    }
})();
