require('dotenv-defaults').config();

const fs = require('fs');
const JiraClient = require('jira-client');
const Worklog = require('./src/models/Worklog');
const Issue = require('./src/models/Issue');

const Jira = new JiraClient({
    protocol: 'https',
    host: process.env.JIRAHOST,
    username: process.env.JIRANAME,
    password: process.env.JIRAPWD,
    apiVersion: '2',
    strictSSL: true  
});




Jira.getIssuesForBoard(2, 0, 50, null, true, ["worklog", "summary"])
    .then(function(data) {

        const list = data.issues.map(issue => new Issue(issue));
        list.forEach(issue => console.log(`[${issue.name}] => ${issue.getTotalSpentTime()}`));
        let str = JSON.stringify(list);  
        fs.writeFileSync(`./issues/issuesb.json`, str);
    })
    .catch(function(err) {
        console.error(err);
    });
