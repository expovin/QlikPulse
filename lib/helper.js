// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 

module.exports = {

    makeActionButtonsForSkills : function (skills, infoToSave) {
                                    var actions=[];
                                    var promises=[];
                                    //var skillList = JSON.parse(skills);
                                    var skillList = skills;
                                    console.log("Helper skills : ",skillList.Skills);
                                    return new Promise ( function (fulfill, reject){
                                        
                                        for(var i of skillList.Skills){
                                            action={name:'', text:'', type:'button', value : ''};
                                            if(infoToSave)
                                                action.name=infoToSave;
                                            else
                                                action.name=i.skill;
                                            action.text=i.skill;
                                            action.value=i.skill;
                                            actions.push(action);
                                        }
                                        fulfill(actions);
                                    })
                                },


    filterBySkillName :         function (skillName) {
                                    return function(element) {
                                        if(element.value){
                                            if(element.value.toLowerCase().indexOf(skillName)>= 0)
                                                return true;
                                        
                                        }
                                    }
                                }
}