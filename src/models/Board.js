require('dotenv-defaults').config();

const { Auth } = require('../auth')
const Issue = require('./Issue');


const getAllIssues = (id) => {
    return Auth.getIssuesForBoard(id, 0, 50, null, true)
        .then(function(data) {
            const list = data.issues.map(issue => new Issue(issue));

            //LOG
            list.forEach(issue => console.log(`[${issue.name}] => ${issue.getTotalSpentTime()}, Authors: ${issue.getParticipants()}`));
            
            return list;

        })
}

class Board {

    constructor(id) {
        this.id = id;
    }



    getAllIssues(){
        //TODO: Cycle over pagination
        return getAllIssues(this.id);
        
    }

    getIssuesBetween(first, last){
        return getAllIssues(this.id)
            .then(issues => issues.filter(issue => issue.isBetween(first, last)));
    }

    getUsers(){}



    getWorklogTime(first, last, username){




    }

}

module.exports = Board;