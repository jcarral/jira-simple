require('dotenv-defaults').config();

const request = require('request');

const defaultOptions = {
   method: 'GET',
   url: process.env.JIRAHOST + '/rest/api/3/search?jql=project%20%3D%20SMC',
   auth: { username: process.env.JIRANAME, password: process.env.JIRAPWD },
   headers: {
      'Accept': 'application/json'
   }
};

function buildJql(json) {
    return '?jql=' + 
        Object.keys(json).slice(0).reverse().map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

// const auth = new JiraClient({
//     protocol: 'https',
//     host: process.env.JIRAHOST,
//     username: process.env.JIRANAME,
//     password: process.env.JIRAPWD,
//     apiVersion: '2',
//     strictSSL: true  
// });

const auth = {
    get : (boardId, queryOptions = {}) => {
        queryOptions.project = boardId;
        const url = process.env.JIRAHOST + '/rest/api/3/search' + buildJql(queryOptions) + "& worklogDate>0";
        const options = Object.assign({}, defaultOptions, { url });

        return new Promise((resolve, reject) => {
            return request(options, function (error, response, body) {
                if (error) return reject(error);
                return resolve(JSON.parse(body));
             });
        })
    }
};

module.exports = auth;