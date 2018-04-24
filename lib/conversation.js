'use strict'
var cfg = require('../config');
var log = require('../lib/logHandler');
var msg = require('../conversations');
var convPath = require('./conversationalPath');
var cloner = require('cloner');

var _db;
var _neo;
var _this;

var dismissButton = {
    name : "Dismiss",
    text : "Dismiss",
    type : "button",
    value: "Dismiss",
    style: "danger"
}

log.info("Set default lang for Messages : eng");
var message = "eng";

class conversation {

    constructor(bot, db){
        _neo=bot;
        _db=db;
    }


    askForHappiness(users){
        var promises=[];
        var count=0;

        log.debug("Start askForHappiness on ",users.length," users");
        log.trace("They are : ",users);

        return new Promise (function (fulfill, reject){

            /****************** SET INTERVAL TO AVOID SUB-SECOND API REUEST ********************/
            var interval = setInterval ( function(){
                if(users[count].trigram !== null){
                    log.debug("Ask how is happy to : ",users[count].trigram);

                    promises.push(
                        _neo.postMessage(users[count].USERID, convPath.askForHappiness.message, true, convPath.askForHappiness.attachments)
                        .then( result =>{
                            fulfill(result);
                        })
                    )
                }
                count++;
                if(count >= users.length) clearInterval(interval);
            }, cfg.botSettings.TimeBetweenCalls)
            /********************************************************************************* */

            Promise.all(promises)
            .then( () =>{
                log.trace("Asked to users relevant words for skill");
                fulfill("Asked all users for set their trigram");
            })

        })
    }


    handleResponse(response){

        log.debug(" handleResponse ",response);
        var action=convPath[response.callback_id];
        if(response.actions)
            var risposta=response.actions[0].value;
        else
            var risposta="Dismiss"

        log.trace(" action",action);
        log.debug("risposta : ",risposta);
        
        
        if(risposta === "Dismiss")
            var text = action.dismiss;
        else
            var text = action.message.replace("$1",risposta);

        log.debug("Message to respond : ",action.message," - ",risposta);
        
        //log.trace("response.callback_id : ",response.callback_id, " convPath.askTrigram : ",convPath.askTrigram);
        return new Promise (function (fulfill, reject){
            var body = {
                channel : response.channel.id,
                text : text,
                as_user : true, 
                attachments : action.attachments,
                icon_emoji :null,
                icon_url : null,
                link_names : null,
                parse : "none",
                reply_broadcast : null,
                thread_ts : response.message_ts,
                unfurl_links : null,
                unfurl_media : null,
                username : null
            }

            if(response.callback_id === "askForHappinessHandleResp")
            {
                log.debug("Open Dialog");
                _neo.openDialog(  action.dialog , response)
                .then( r =>{
                    log.trace("Request sent, response: ",r);
                    //action.PostAction(r,response);
                })
                .catch( error =>{
                    reject(error);
                })
            }
            else {
                log.debug("Interactive response");
                _neo.interactiveResponse(  response.response_url , body, false )
                .then( r =>{
                    log.trace("Request sent, response: ",r);
                    action.PostAction(r,response);
                })
                .catch( error =>{
                    reject(error);
                })
            }
        })
    }
}


module.exports = conversation;