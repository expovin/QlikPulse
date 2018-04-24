'use strict'
var log = require('./lib/logHandler');

var _defLang;

var bufMessages = {
    eng :{
        yes : "yes",
        no : "no",
        requestJoin : "Please can you invite me to join the channel ",
        tanksJoined : "thanks for adding me to channel ",
        introduceMe : "Let introduce myself. I'm a BoT and despite the ordinary people's thought about BoTs, I'm not (yet) so clever." 
                        + "So I can't yet answer questions, please use a bit of common sense with me.",




        askForHappiness : {
            pre : "Qlik Pulse",
            in : "How was your week?",
            fall : "Sorry, seems there is some error"
        },
        askForMood : {
            pre : "Qlik Pulse",
            in : "One word characterizing your week",
            fall : "Sorry, seems there is some error"
        },

        Errors : {
            setTrigram : "Error while setting trigram, please try again later",
            chkToken : "Error verification token not valid. Please contact your administrator",
            usrDetails : "Error while getting user details, please try again later"
        }
    },

    dismissButton : {
        name : "Dismiss",
        text : "Dismiss",
        type : "button",
        value: "Dismiss",
        style: "danger"
    }
}

class messages {

    constructor(defLang){
        _defLang=defLang;        
    }

    dismissButton(){
        return bufMessages.dismissButton;
    }

    getMessage(msg, lang){
        log.trace("In Get message msg : ",msg," lang : ",lang);

        if(lang === undefined)
            lang = _defLang;

        var MsgPath = msg.split(".");

        var path="";
        MsgPath.forEach (level => {
            path+="['"+level+"']";
        })

        if(bufMessages[lang][msg])
            return eval("bufMessages[lang]"+path);
        else
            return eval("bufMessages[_defLang]"+path);
    }

}

module.exports = messages;  