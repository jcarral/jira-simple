require('dotenv-defaults').config();

const JiraClient = require('jira-client');

const auth = new JiraClient({
    protocol: 'https',
    host: process.env.JIRAHOST,
    username: process.env.JIRANAME,
    password: process.env.JIRAPWD,
    apiVersion: '2',
    strictSSL: true  
});


module.exports = auth;