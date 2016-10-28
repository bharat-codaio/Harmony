/**
 * Created by bharatbatra on 10/27/16.
 */
(() => {
    'use strict';

    angular
        .module('app')
        .controller('ChatThreadController', ChatThreadController);


    function ChatThreadController(){
        console.log("chat thread controller active")
    }
})();
