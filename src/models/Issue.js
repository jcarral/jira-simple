require('dotenv-defaults').config();
const moment = require('moment');

const Worklog = require('./Worklog');
const User = require('./User');
const Time = require('./Time');

const logger = require('../utils/log.utils');
const { unique } = require('../utils/array.utils');

class IssueType {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}

class Priority {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}

class Status {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}

class Issue {

    constructor(data) {

        const {
            id,
            key,
            fields
        } = data;
        const {
            worklog,
            summary,
            issuetype,
            timespent,
            created,
            priority,
            labels,
            timeestimate,
            asignee,
            updated,
            status,
            description,
            timetracking,
            creator,
            reporter
        } = fields;



        this.id = id;
        this.name = key;
        this.worklogs = (worklog ? worklog.worklogs : []).map(wl => new Worklog(wl, key));
        this.summary = summary;
        this.created = moment(created, "YYYY-MM-DDTHH:mm:ss");
        this.priority = new Priority(priority);
        this.timeestimate = new Time(timeestimate);
        this.asignee = new User(asignee);
        this.updated = moment(updated, "YYYY-MM-DDTHH:mm:ss");
        this.status = new Status(status);
        this.description = description;
        this.timetracking = new Time(timetracking.remainingEstimateSeconds);
        this.timespent = new Time(timespent);
        this.issuetype = new IssueType(issuetype);
        this.creator = new User(creator);
        this.reporter = new User(reporter);

        logger.debug(`[ISSUE] ${id} - ${key}. Created by ${this.creator.toString()} `);
    }

    getTotalTime() {
        return this.worklogs.reduce((prev, current) => {
             return prev + current.seconds;
         }, 0);
    }

    getAuthors() {
        return unique(this.worklogs.map(wl => wl.author), 'name');
    }

    isBetween(first, last) {
        const validWl = this.worklogs.map(wl => wl.isBetween(first, last)).filter(wl => wl !== null);

        if (validWl && validWl.length > 0) {
            const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
            clone.worklogs = validWl;
            return clone;
        } else {
            return null;
        }
    }

    filterByUser(username) {
        const validWl = this.worklogs.filter(wl => wl.author.name === username);

        if (validWl && validWl.length > 0) {
            const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
            clone.worklogs = validWl;
            return clone;
        } else {
            return null;
        }
    }

    lastUpdate() {
         const first = new Worklog(null, null, {
              updated: '0000-01-01'
          });
          const last = this.worklogs.reduce((prev, current) => prev.updated > current.updated ? prev : current, first);

          return first.updated === last.updated ? null : last.updated;
    }

    getTotalTime() {
        return this.worklogs.reduce((prev, curr) => prev + curr.time.seconds, 0);
    }



};

module.exports = Issue;