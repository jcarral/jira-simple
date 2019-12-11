require('dotenv-defaults').config();
const Worklog = require('./Worklog');
const { unique } = require('../utils/array.utils');

class Issue {

    constructor(data) {

        const { id, key, fields } = data;
        const { worklog, summary } = fields;
        
        console.log(`[ISSUE] ${id} - ${key}, wl count ${(worklog? worklog.worklogs : []).length}`);

        this.id = id;
        this.name = key;
        this.worklogs = (worklog ? worklog.worklogs : []).map(wl => new Worklog(key, id, wl));
        this.summary = summary;
    }

    getTotalSpentTime(month){
        return this.worklogs.reduce((prev, current) => {
            return prev + current.seconds;
        }, 0);
    }

    filterByContributor(name) {

    }

    getParticipants(){
        return [... new Set(this.worklogs.map(wl => wl.author))]
    };

    isBetween(first, last){
        return this.worklogs.some(wl => wl.isBetween(first, last));
    }

    lastUpdate(){
        console.log('Calling last update')
        const first = new Worklog(null, null, { updated : '1000-01-01'}); 
        const last = this.worklogs.reduce((prev, current) => prev.updated > current.updated ? prev : current, first);

        return first.updated === last.updated ? null : last.updated;
    }

    getTotalTime(){

    }

    getTimeBetween(){

    }

};

module.exports = Issue;