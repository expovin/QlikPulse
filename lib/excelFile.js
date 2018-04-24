'use strict'
var xlsx = require('xlsx');
var log = require('../lib/logHandler');

var _lookUpExcFile={};

class lookUpTable {
    constructor (lookUpFile) {
        log.info("Opening file ",lookUpFile);
        var workbook = xlsx.readFile(lookUpFile.File);
        var worksheet = workbook.Sheets[lookUpFile.Sheet];
        var headers = {};
        var data = [];
        for(var z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;
    
            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }
    
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        data.shift();
        data.shift();
        this.makeDict(data);
    }

    makeDict(data){
        this._lookUpExcFile={};

        data.forEach( emp => {
            this._lookUpExcFile[emp.Trigram] = emp;
        })
    }

    getTableData(){
        return(this._lookUpExcFile);
    }

    getFirstName(trigram) {
        return(this._lookUpExcFile[trigram]["First Name"]);
    }

    getLastName(trigram) {
        return(this._lookUpExcFile[trigram]["Last Name"]);
    }

    getPosition(trigram) {
        return(this._lookUpExcFile[trigram].Position);
    }

    getRole(trigram) {
        return(this._lookUpExcFile[trigram].Role);
    }

    getLocation(trigram) {
        return(this._lookUpExcFile[trigram].Location);
    }

    getID(trigram) {
        return(this._lookUpExcFile[trigram].ID);
    }

    getCountry(trigram){
        return(this._lookUpExcFile[trigram]["Country of Residence"]);
    }
}

module.exports = lookUpTable;