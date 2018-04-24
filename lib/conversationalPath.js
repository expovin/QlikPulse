'use strict'
var secret = require('../secret');
var log = require('../lib/logHandler');
var msg = require('../conversations');
var repo = require('../lib/repoHandler');
var SkillBot = require('../lib/skillBot');
var excelFile = require('../lib/excelFile');

var lookUpEmp = new excelFile(secret.LookupTable);

const db = new repo(secret.Repository);
log.info("Set default lang for Messages : eng");


var message = new msg('eng');
var neo = new SkillBot({token : secret.YOUQlik.token, name: secret.YOUQlik.name}, db);



/**
  actions: [ { name: 'vbscript', type: 'button', value: 'vbscript' } ],
  callback_id: 'EndorseUser',
  team: { id: 'T2AM51ULS', domain: 'qlikpresales' },
  channel: { id: 'G7PH1N5LY', name: 'privategroup' },
  user: { id: 'U2WA6GS0H', name: 'ves' },
  action_ts: '1511602632.801140',
  message_ts: '1511602625.000016',
  attachment_id: '1',
  token: 'vlBy3PBR30Z6EMhVEje7evEv',
  is_app_unfurl: false,
  response_url: 'https://hooks.slack.com/actions/T2AM51ULS/277380455346/6gtM6N5T7IZWm8c8zFEXJGXG',
  trigger_id: '278255151734.78719062706.25a8f9dbe1d39fe04c2ee636c45f6161' }
 */


module.exports  = {


    askForHappiness : {
        message : message.getMessage("askForHappiness.pre"),
        attachments : [
            {
                text: message.getMessage("askForHappiness.in"),
                fallback: message.getMessage("askForHappiness.fall"),
                callback_id: "askForHappinessHandleResp",
                color: "#3AA3E3",
                attachment_type: "default",
                actions: [
                    {name:"VeryHappy", text:":smile:", type : "button", value : 4},
                    {name:"Happy", text:":wink:", type : "button", value : 3},                    
                    {name:"So so", text:":expressionless:", type : "button", value : 2},
                    {name:"Sad", text:":disappointed:", type : "button", value : 1},
                ]
            }
        ]
    },
    askForHappinessHandleResp : {
        message : message.getMessage("askForMood.pre"),
        dialog: {
            callback_id: "askForMoodHandleResp",
            title: message.getMessage("askForMood.pre"),
            submit_label: "Send",
            elements: [
                {
                    type: "text",
                    label: "One word for your week",
                    name: "Mood",
                    hint : "One adjective for your week"
                }
            ]
        }
    },
    askForMoodHandleResp : {
        message : "Thank you!",
        PostAction : function(skill, risposta){
            log.info("Skill : ",skill);
            log.info("Response : ",risposta);
            db.addNewHappyRank(lookUpEmp.getCountry(risposta.user.name), Object.keys(risposta.submission)[0],risposta.submission[Object.keys(risposta.submission)[0]])
            .then( res =>{
                log.info("Added user Happines response : ",res);
            })
            .catch( error =>{
                log.error("Error adding Happiness rank : ",error);
            })
        }
    }
}
 
