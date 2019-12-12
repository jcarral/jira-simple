require('dotenv-defaults').config();
const {
    Auth
} = require('../auth')
const Issue = require('./Issue');

const BATCH = 50;

const getAllIssues = (id) => {
    return Auth.getIssuesForBoard(id, 0, 50, null, true)
        .then(function (data) {
            const list = data.issues.map(issue => new Issue(issue));

            //LOG
            list.forEach(issue => console.log(`[${issue.name}] => ${issue.getTotalSpentTime()}, Authors: ${issue.getParticipants()}`));

            return list;

        })
};


const requestBoardData = async (id) => {

    let idx = 0;
    const data = await Auth.getIssuesForBoard(id, idx, BATCH, null, true);
    let totalResults = data.total;
    let issues = data.issues;
  
    while(issues.length < totalResults) {
        idx++;
        let tmpData = await Auth.getIssuesForBoard(id, idx*BATCH, BATCH, null, true);
        issues = issues.concat(tmpData.issues);
    }
    return issues;
};

const buildBoard = issues => {
    return issues.map(issue => new Issue(issue));
};


class Board {

    constructor(id) {
        this.id = id;
        return requestBoardData(id)
            .then(buildBoard)
            .then(issues => this.issues = issues)
            .then(() => this);
    }

    getAllIssues() {
        return getAllIssues(this.id);

    }

    getIssuesBetween(first, last) {
        return getAllIssues(this.id)
            .then(issues => issues.filter(issue => issue.isBetween(first, last)));
    }

    getUsers() {}
    getIssues(first, last) {
        return this.issues.map(issue => issue.isBetween(first, last)).filter(issue => issue !== null);
    }
    
    getLogs(first, last){}


}

module.exports = Board;