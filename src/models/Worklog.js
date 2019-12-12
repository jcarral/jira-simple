require('dotenv-defaults').config();
const moment = require('moment');

const Time = require('./Time');
const User = require('./User');
const logger = require('../utils/log.utils');

class Worklog {


    constructor(data) {
        const { id, created, timeSpentSeconds, author = {}, started, updated, comment, issueId } = data;
        
        
        this.issueId = issueId;
        this.id = id;
        this.time = new Time(timeSpentSeconds);
        this.author = new User(author);
        this.created = moment(created, "YYYY-MM-DDTHH:mm:ss");
        this.started = moment(started, "YYYY-MM-DDTHH:mm:ss");
        this.updated = moment(updated, "YYYY-MM-DDTHH:mm:ss");
        this.comment = comment;
        
        logger.debug(`[WORKLOG][${issueId}] ${id}. Author => ${author.name}. Time => ${this.time.seconds}`);
    }

    isBetween(first, last) {
        return this.started.isBetween(first, last) ? this : null;
    }

}


module.exports = Worklog;