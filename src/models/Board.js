require('dotenv-defaults').config();
const Jira = require('../api/Jira')
const Issue = require('./Issue');

const BATCH = 50;
const FIELDS = 'worklog,summary,issuetype,timespent,created,priority,labels,timeestimate,asignee,updated,status,description,timetracking,creator,reporter';


const getAllIssues = (id) => {
    return Jira.getIssues(id, 0, 50)
        .then(function (data) {
            const list = data.issues.map(issue => new Issue(issue));

            //LOG
            list.forEach(issue => console.log(`[${issue.name}] => ${issue.getTotalSpentTime()}, Jiraors: ${issue.getParticipants()}`));

            return list;

        })
};


const requestBoardData = async (id) => {

    let idx = 0;
    const data = await Jira.getIssues(id, { startAt : idx, maxResults: BATCH, fields : FIELDS });
    let totalResults = data.total;
    let issues = data.issues;
  
    while(issues.length < totalResults) {
        idx++;
        let tmpData = await Jira.getIssues(id, { startAt : idx*BATCH, maxResults: BATCH,  fields : FIELDS});
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

    getUsers() {}
    getIssues(first, last) {
        return this.issues.map(issue => issue.isBetween(first, last)).filter(issue => issue !== null);
    }
    
    getLogs(first, last){}


}

module.exports = Board;