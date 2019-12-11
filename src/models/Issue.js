require('dotenv-defaults').config();
const Worklog = require('./Worklog');


class Issue {

    constructor(data) {
        const { id, key, fields } = data;
        const { worklog, summary } = fields;
        this.id = id;
        this.name = key;
        this.worklogs = worklog.worklogs.map(wl => new Worklog(wl));
        this.summary = summary;
    }

    getTotalSpentTime(month){
        return this.worklogs.reduce((prev, current) => {
            return prev + current.seconds;
        }, 0);
    }


    filterByMonth(month) {

    }

    filterByContributor(name) {

    }
};

module.exports = Issue;