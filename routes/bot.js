var express = require('express');
var secret = require('../secret');
var conv = require("../conversations");
var SkillBot = require('../lib/skillBot');
var log = require('../lib/logHandler');
var repo = require('../lib/repoHandler');
var conversation = require('../lib/conversation');
var hlp = require('../lib/helper');
var excelFile = require('../lib/excelFile');

var router = express.Router();

log.info("Starting Bot");
const db = new repo(secret.Repository);
var YOUQlik = new SkillBot({token : secret.YOUQlik.token, 
                            name: secret.YOUQlik.name}, 
                            db);


const cv = new conversation(YOUQlik, db);



/* GET users listing. */
router.route('/')
.get(function(req, res, next) {
    res.json({status:'OK'});
  });


router.route('/sendMessage/interactive')
.post(function (req, res, body){
    var payload = JSON.parse(req.body.payload);
    res.status(200).json();
    if(payload.token === secret.YOUQlik.VerificationToken){
        log.info("Received valid interactive response. Token verified!");
        log.info("Interactive component req : ", payload);
        

        db.setComunicationInProgress(payload.user.id, false)
        .then(  result => {
            log.debug("set Flag Comunication terminated ",result);
        })

        cv.handleResponse(payload)
        .then( (response) =>{
            log.info("Comunication complete!");
            //res.status(200).json(response);
        })
        .catch( error =>{
            log.error("Error handling the user interactive response :",error);
        })
        
    }
})


router.route('/happiness')
.get(function(req, res, next) {
    db.getUsers( true)

    .then( users =>{
        return cv.askForHappiness(users);
    } )
    .then ( result =>{
        res.json(result);
    })
    .catch( error =>{
        log.error("Error in happiness chain ",error);
        res.json(error);
    })
})

module.exports = router;
