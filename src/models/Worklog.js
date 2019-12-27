const moment = require('moment');

const Time = require('./Time');
const User = require('./User');

const getComment = (comment = {}) => {
    const { content = [] } = comment;

    let responseText = '';

    content.forEach(paragraph => {

        const { content = [] } = paragraph;
        content.forEach(p => {
            const { text = '' } = p;
            responseText += (text + "\n");
        });

        responseText += '\n\n';
    })

    return responseText;

}


class Worklog {

    constructor(data, issueName) {
        const { id, created, timeSpentSeconds, author = {}, started, updated, comment, issueId } = data;
        
        
        this.issueId = issueId;
        this.issueName = issueName;
        this.id = id;
        this.time = new Time(timeSpentSeconds);
        this.author = new User(author);
        this.created = moment(created, "YYYY-MM-DDTHH:mm:ss");
        this.started = moment(started, "YYYY-MM-DDTHH:mm:ss");
        this.updated = moment(updated, "YYYY-MM-DDTHH:mm:ss");
        this.comment = getComment(comment);
        
    }

    isBetween(first, last) {
        return this.started.isBetween(first, last) ? this : null;
    }

}


module.exports = Worklog;