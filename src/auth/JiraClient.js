const request = require('request');

const Errors = require('../constants/Errors');
const Board = require('../models/Board');

const defaultOpts = {
    protocol: 'https',
    apiVersion: '3',
    strictSSL: true
};
const BATCH = 50;
const BOARD_ISSUE_FIELDS = 'worklog,summary,issuetype,timespent,created,priority,labels,timeestimate,asignee,updated,status,description,timetracking,creator,reporter';


const stringExists = val => typeof val === typeof "string" && val && val.length > 0;

const buildJql = json => {
    return '?jql=' + 
        Object.keys(json).slice(0).reverse().map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
};

const makeRequest = async (options) => {
    return new Promise((resolve, reject) => {
        return request(options, (err, res, body) => {
            if(err) return reject(err);
            return resolve(JSON.parse(body));
        });
    });
}

const requestWorklogs = async (boardOptions, issueIdOrKey) => {
    const requestOptions = {
        method: 'GET',
        auth : { username : boardOptions.username, password: boardOptions.password },
        url: `${boardOptions.host}/rest/api/2/issue/${issueIdOrKey}/worklog`,
        headers: {
            'Accept': 'application/json; charset=utf-8',
            'Content-type': 'application/json; charset=utf-8'
         }
    }

    return makeRequest(requestOptions);
}

const requestBoard = async (boardOptions, boardId, jqlFilters = {}) => {
    
    jqlFilters.project = boardId;

    const requestOptions = {
        method: 'GET',
        auth : { username : boardOptions.username, password: boardOptions.password },
        url: `${boardOptions.host}/rest/api/2/search${buildJql(jqlFilters)}&worklogDate>0`,
        headers: {
            'Accept': 'application/json; charset=utf-8',
            'Content-type': 'application/json; charset=utf-8'
         }
    }
    return makeRequest(requestOptions);

};


const updateWorklogs = async (boardOptions, issues) => {
    let nextIssues = [];
    for(let issue of issues) {

        if(issue.fields && issue.fields.worklog && issue.fields.worklog && issue.fields.worklog.total > 19) {
            const res = await requestWorklogs(boardOptions, issue.id)
            issue.fields.worklog.worklogs = res.worklogs;
        } 
        nextIssues.push(issue);
    }
    return nextIssues;
}


class Jira {

    constructor(config = {}){

        if(!stringExists(config.username)) {
            throw new Error(Errors.USERNAME_REQUIRED);
        } else if(!stringExists(config.password) && !stringExists(config.token)) {
            throw new Error(Errors.TOKEN_REQUIRED);
        } else if(!stringExists(config.host)){
            throw new Error(Errors.HOST_IS_REQUIRED);
        }

        const nextOptions = {
            password : config.password || config.token,
        };

        this.options = Object.assign({}, defaultOpts, config, nextOptions);
        
    }

    async getBoard(boardName) {
        if(!stringExists(boardName)){
            throw new Error(Errors.BOARD_ID_IS_REQUIRED);
        }

        let idx = 0;
        const data = await requestBoard(this.options, boardName, { startAt: idx, maxResults: BATCH, fields: BOARD_ISSUE_FIELDS });
        let totalResults = data.total;
        let issues = await updateWorklogs(this.options, data.issues);
    
        while (issues.length < totalResults) {
            idx++;
            let tmpData = await requestBoard(this.options, boardName, { startAt: idx * BATCH, maxResults: BATCH, fields: BOARD_ISSUE_FIELDS });
            let tmpIssues = await updateWorklogs(this.options, tmpData.issues);
            issues = issues.concat(tmpIssues);
        }
        
        return new Board(boardName, issues);
    }
    /*
    async getIssue(issueName) {}
    */
}

module.exports = Jira;