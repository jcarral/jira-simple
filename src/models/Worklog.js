require('dotenv-defaults').config();
const moment = require('moment');


class Worklog {


    constructor(key, issueId, data) {
        const { id, timeSpentSeconds, author = {}, started, updated, comment } = data;
        
        console.log(`[WORKLOG][${key}][${issueId}] ${id} `);
        

        this.issueName = key;
        this.issueId = issueId;
        this.id = id;
        this.seconds = timeSpentSeconds;
        this.author = author.name;
        this.started = moment(started, "YYYY-MM-DDTHH:mm:ss");
        this.updated = moment(updated, "YYYY-MM-DDTHH:mm:ss");
        this.comment = comment;

    }

    isBetween(first, last) {
        return this.started.isBetween(first, last);
    }

}


module.exports = Worklog;