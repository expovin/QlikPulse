var log4js = require('log4js');
var cfg = require('../config');




log4js.configure({
  appenders: 
  {
  file : { 
        type: 'file', 
        filename: cfg.Log.OutputFileGeneral, 
        maxLogSize: cfg.Log.maxLogSize, 
        backups: cfg.Log.backups, 
        compress: cfg.Log.compress, 
        layout: 
          {
            type: 'pattern', 
            pattern: "%[[%d %r] [%p%]] - %c %h %z - %m"
          } 
  },
  out : { 
        type: 'stdout' , 
        layout: 
          {
            type: 'pattern', 
            pattern: "%[[%d %r] [%p]%] - %c %h %z - %m"
          }
      }
  },
  categories: {
    both: { appenders: [ 'file','out' ], level: cfg.Log.DefaultLevel},
    default : { appenders: [ 'file' ], level: cfg.Log.DefaultLevel},
    out: { appenders: [ 'out' ], level: cfg.Log.DefaultLevel}
  }
});


var logger = log4js.getLogger(cfg.Log.appender);


module.exports = logger
