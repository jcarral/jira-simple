require('dotenv-defaults').config();

const { Auth } = require('../auth');
const Issue = require('./Issue');

const fs = require('fs');

class Author {

    constructor(data = {}){
        const { username, name = '', displayName = ''} = data;
        this.username = username || name;
        this.name = displayName;

    }

    getIssues(first, last){
        let openedIssues = [];
        let closedIssues = [];

        return Auth.getUsersIssues(this.username, true)
            .then(issues => {
                openedIssues = issues.issues.map(issue => new Issue(issue));
                console.log(openedIssues)
                return Auth.getUsersIssues(this.username, false);
            })
            .then(issues => {
                closedIssues = issues.issues.map(issue => new Issue(issue));
                console.log(closedIssues)

                let str = JSON.stringify(issues);  
        fs.writeFileSync(`./str.json`, str);
                return openedIssues.join(closedIssues);
            })
    };

}

module.exports = Author;