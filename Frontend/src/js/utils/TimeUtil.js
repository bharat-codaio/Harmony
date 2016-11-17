/**
 * Created by bharatbatra on 11/3/16.
 */

var formatAMPM = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return  hours + ':' + minutes + ' ' + ampm;
};

 var validateHours = function(hrs){
     if(hrs<24 && hrs>=0){
         return true;
     }
     else{
         return false;
     }

};

var validateMins = function(mins){
    if(mins<60 && mins>=0){
        return true;
    }
    else{
        return false;
    }

};

var getDate = function(date){
    var month = date.getMonth()+1;
    if(month<10){
        month = "0" + month;
    }
    return (month + "/" + date.getDate());
};
var ONE_DAY_MILLIS = 24*60*60*1000;