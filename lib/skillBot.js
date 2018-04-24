'use strict'
// Slack Bot library
const Bot = require('slackbots');
// General and public configuration file
var cfg = require('../config');
// Secret configuration file (Tokens and passwords)
var secret = require('../secret');
// Log to file and console
var log = require('../lib/logHandler');
// HTTP(s) requests
var request = require('request');


var _token;
var _db;

class skillBot extends Bot {

    
    constructor(settings, db) {
        log.debug("Start BOT using configuration ", settings);
        super(settings);
        _db=db;

        this._botName=settings.name;
        this._token=settings.token;
        

    }



    makeAPIrequest( paramsName,         // This is an array containing the list of params name  
                    argumentsList,      // This is the array of arguments, the parameters value               
                    url,                // uer endpoint to call
                    method,             // Method to call
                    body,               // Body to send
                    caller)             // Caller function, for logging purpose        
                                                    
    {

        log.trace("makeAPIrequest instanciate with params : ",paramsName," - ",argumentsList," - ", url," - ",method," - ",body," - ",caller);
        var form={};
        // Make the request url endpoint
        
        // Loop over arguments to setup parameters
        for (var i = 0, j = argumentsList.length; i < j; i++){
            log.trace(caller," param: ",paramsName[i],"=",argumentsList[i]);
            form[paramsName[i]]=argumentsList[i]
        }

        log.trace(caller," endpoint base url: ",url );
        // Last REQUIRED parameter the Tocken ID
        form["token"]=this._token;
        

        // Set the request Header
        var headers = {
            'User-Agent':       cfg.UserAgent,
            'Content-Type':     'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: url,
            method: method,
            headers: headers,
            form: form,
            body : body
        }

        log.trace(caller," options: ",options);
        // Send the request to Slack
        return new Promise( function (fulfill, reject ){
            request(options, function (error, response, body) {
                //console.trace("Response Body : ",body);
                if(body){
                    var result = JSON.parse(body);
                    fulfill(result);
                }
                else{
                    log.error("Error Join ",error," status ",body);
                    fulfill("");
                }
            })
        })
    }

    /**
     * Questa funzione consente di richiedere accesso agli scope per il quale il BoT è autorizzato
     * ad utilizzare. Per documentazion completa visitare : https://api.slack.com/docs/oauth
     */
    authentication (client_id,          // BOT Client ID REQUIRED
                    scope,              // permissions to request REQUIRED
                    redirect_uri,       // URL to redirect back to OPTIONAL
                    state,              // unique string to be passed back upon completion OPRIONAL
                    team)               // Slack team ID of a workspace to attempt to restrict to OPTIONAL
    {
        // Makes the params array name  
        var paramsName=['client_id','scope','redirect_uri','state','team'];
        // Makes the params array value
        var args = [].slice.call(arguments);
        // Makes the URL to call
        var url=cfg.SlackAPI.base+cfg.SlackAPI.authentication;

        log.debug("getChannelHistory set paramsName: ",paramsName, " url: ",url, " arguments:",args);

        // Save the context
        var _this=this;
        
        return new Promise( function (fulfill, reject ){
            _this.makeAPIrequest(paramsName, args, url, 'GET', null, 'authentication')
            .then( function(result){
                fulfill(result);
            })
            .catch( function (error){
                log.error("getChannelHistory Error :",error);
                reject(error);
            })
        })
    }

    /**
     * This method deletes a message from a channel. When used with a typical user token, 
     * may only delete messages posted by that user. When used with an admin user's user 
     * token, may delete most messages posted in a workspace. When used with a bot user's 
     * token, may delete only messages posted by that bot user.
     * More info here : https://api.slack.com/methods/chat.delete
     */

     deleteMessage  (   channel,                        //Channel containing the message to be deleted. REQUIRED
                        ts,                             //Timestamp of the message to be deleted. REQUIRED 
                        as_user                         //Pass true to delete the message as the authed user with chat:write:user 
                                                        //scope. Bot users in this context are considered authed users. If unused 
                                                        //or false, the message will be deleted with chat:write:bot scope.
                    ) 
    {
        var url=cfg.SlackAPI.base+cfg.SlackAPI.delete;
        var form={};

        form['token']=this._token;
        form['channel']=channel;
        form['ts']=ts;
        

        // Set the request Header
        var headers = {
            'User-Agent':       cfg.UserAgent,
            'Content-Type':     'application/x-www-form-urlencoded',
            
        }

        // Configure the request
        var options = {
            url: url,
            method: "POST",
            headers: headers,
            form : form,
            body : null
        }

        log.trace("deleteMessage options: ",options);
        // Send the request to Slack
        return new Promise( function (fulfill, reject ){
            request(options, function (error, response, body) {
                //console.trace("Response Body : ",body);
                if(body){
                    var result = JSON.parse(body);
                    fulfill(result);
                }
                else{
                    log.error("deleteMessage Error Join ",error," status ",body);
                    fulfill("");
                }
            })
        })
    }

    /**
     * Open a dialog with a user by exchanging a trigger_id received from another interaction. 
     * See the dialogs documentation to learn how to obtain triggers define form elements
     * More info here : https://api.slack.com/methods/dialog.open
     */

     openDialog (   dialog,                         // The dialog definition. This must be a JSON-encoded string. REQUIRED
                    response                      // Exchange a trigger to post to the user.
                )
    {

        var url=cfg.SlackAPI.base+cfg.SlackAPI.dialog;
        var form={};

        dialog.elements[0].name=response.actions[0].value;

        form['token']=this._token;
        form['dialog']=JSON.stringify(dialog);
        form['trigger_id']=response.trigger_id;
        

        // Set the request Header
        var headers = {
            'User-Agent':       cfg.UserAgent,
            'Content-Type':     'application/x-www-form-urlencoded',
            
        }

        // Configure the request
        var options = {
            url: url,
            method: "POST",
            headers: headers,
            form : form,
            body : null
        }

        var oriResponse = response;
        var _this=this;

        log.trace("openDialog options: ",options);
        // Send the request to Slack
        return new Promise( function (fulfill, reject ){
            request(options, function (error, response, body) {
                //console.trace("Response Body : ",body);
                if(body){
                    var result = JSON.parse(body);
                    _this.deleteMessage(oriResponse.channel.id, oriResponse.message_ts);
                    fulfill(result);
                }
                else{
                    log.error("openDialog Error Join ",error," status ",body);
                    fulfill("");
                }
            })
        })
    }



    /**
     * For the complete documentation visit https://api.slack.com/methods/chat.postMessage
     * @param {*} channel 
     * @param {*} text 
     * @param {*} as_user 
     * @param {*} attachments 
     * @param {*} icon_emoji 
     * @param {*} icon_url 
     * @param {*} link_names 
     * @param {*} parse 
     * @param {*} reply_broadcast 
     * @param {*} thread_ts 
     * @param {*} unfurl_links 
     * @param {*} unfurl_media 
     * @param {*} username 
     */
    postMessage(        channel,                      // Channel, private group, or IM channel to send message to. 
                        text,                         // Text of the message to send. See below for an explanation of formatting. 
                        as_user,                      // Pass true to post the message as the authed user, instead of as a bot. 
                        attachments,                  // A JSON-based array of structured attachments, presented as a URL-encoded string.
                        icon_emoji,                   // Emoji to use as the icon for this message. 
                        icon_url,                     // URL to an image to use as the icon for this message. 
                        link_names,                   // Find and link channel names and usernames.
                        parse,                        // Change how messages are treated
                        reply_broadcast  ,            // Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel or conversation. 
                        thread_ts,                    // Provide another message's ts value to make this message a reply.
                        unfurl_links,                 // Pass true to enable unfurling of primarily text-based content.
                        unfurl_media,                 // Pass false to disable unfurling of media content.
                        username                     // Set your bot's user name. 
                )                    
    {
        var newArgs=[];



        if(as_user == undefined) {log.trace("Param as_user undefined. Set default false"); as_user=false};

        if(attachments == undefined) {
            log.trace("Param attachments undefined. Set default null"); 
            attachments=null;
        }
        else {
            attachments=JSON.stringify(attachments);
            log.trace("Param attachments defined. Stringify it : ",attachments);
        }
        
                    

        if(icon_emoji === undefined) {log.trace("Param icon_emoji undefined. Set default null"); icon_emoji=null;}
        if(icon_url === undefined) {log.trace("Param icon_url undefined. Set default null"); icon_url=null;}
        if(link_names === undefined) {log.trace("Param link_names undefined. Set default null"); link_names=null;}
        if(parse === undefined) {log.trace("Param parse undefined. Set default none"); parse="none";}
        if(reply_broadcast == undefined) {log.trace("Param reply_broadcast undefined. Set default false"); reply_broadcast=false;}
        if(thread_ts == undefined) {log.trace("Param thread_ts undefined. Set default null");  thread_ts=null;}
        if(unfurl_links == undefined) {log.trace("Param unfurl_links undefined. Set default null"); unfurl_links=null;}
        if(unfurl_media == undefined) {log.trace("Param unfurl_media undefined. Set default null"); unfurl_media=null;}
        if(username == undefined) {log.trace("Param username undefined. Set default null"); username=null;}

        newArgs.push(channel);
        newArgs.push(text);
        newArgs.push(as_user);
        newArgs.push(attachments);
        newArgs.push(icon_emoji);
        newArgs.push(icon_url);
        newArgs.push(link_names);
        newArgs.push(parse);
        newArgs.push(reply_broadcast);
        newArgs.push(thread_ts);
        newArgs.push(unfurl_links);
        newArgs.push(unfurl_media);
        newArgs.push(username);

        // Makes the params array name  
        var paramsName=['channel','text','as_user','attachments','icon_emoji','icon_url','link_names','parse','reply_broadcast','thread_ts','unfurl_links','unfurl_media','username'];
        // Makes the params array value
        var args = [].slice.call(arguments);
        // Makes the URL to call
        var url=cfg.SlackAPI.base+cfg.SlackAPI.chatPostMessage;

        log.debug("postMessage set paramsName: ",paramsName, " url: ",url, " arguments:",newArgs);

        // Save the context
        var _this=this;


        return new Promise( function (fulfill, reject ){
            _this.makeAPIrequest(paramsName, newArgs, url, 'POST', null, 'postMessage')
            .then( function(result){
                log.debug(result);

                _db.setUserLastTs(channel, result.ts)
                .then( (r) => {
                    if (r.status)
                        log.info("Asked to user ",channel," to set the trigram");
                    else
                        log.warn("Error while asking for set trigtram to user ", channel," err : ",r.err);
                })
                .catch(error =>{
                    reject(error);
                })


                fulfill(result);
            })
            .catch( error =>{
                reject(error);
            })
        })

    }

    interactiveResponse(response_url, body, comunication_status ){

        log.debug("Send interactive response url : ",response_url," body : ",body," comunication status : ",comunication_status);
        // Set the request Header
        var headers = {
            'User-Agent':       cfg.UserAgent,
            'Content-Type':     'application/json'
        }

        // Configure the request
        var options = {
            url: response_url,
            method: "POST",
            headers: headers,
            body : body,
            json:true
        }

        log.trace("Options : ",options);
        // Send the request to Slack
        return new Promise( function (fulfill, reject ){
            request.post(options, function (error, response, Innerbody) {
                log.trace("Innerbody : ",Innerbody);
                if(comunication_status){
                    _db.setComunicationInProgress(body.channel, true)
                    .then ( r =>{
                        if (r.status)
                            log.info("Comunication in progress set for user ",body.channel);
                        else
                            log.warn("Error while setting comunication in progress for user ", body.channel," err : ",r.err);
                    })
                    .catch(error =>{
                        reject(error);
                    })
                }
                fulfill({status : 'OK'});
            })
        })

    }

}




module.exports = skillBot;