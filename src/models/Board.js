const Issue = require('./Issue');
const {
    unique,
    flat
} = require('../utils/array.utils');


const buildBoard = srcIssues => {

    const issues = srcIssues.map(issue => new Issue(issue));
    let users = [];
    let status = [];
    let types = [];
    let priorities = [];

    issues.forEach(issue => {
        users = users.concat(issue.getAuthors());
        status.push(issue.status);
        types.push(issue.issuetype);
        priorities.push(issue.priority);
    });

    users = unique(users, 'name');
    status = unique(status, 'name');
    types = unique(types, 'name');
    priorities = unique(priorities, 'name');

    return {
        users,
        issues,
        status,
        types,
        priorities,
    };
};

const applyFilter = (key, filters, issue) => {
    const value = filters[key];
    if(!issue) return;
    switch (key) {
        case 'worklogAuthor':
            return issue.filterByUser(value);
        case 'searchTerm':
            return issue.filterByName(value);
        default:
            break;
    }
}

const shouldApplyExtraFilters = filters => Object.keys(filters).filter(key => filters[key] && filters[key].length).length;

const issueReduceFn = filters => (prev = [], issue) => {
    
    let issueToMap = issue;
    Object.keys(filters).forEach(key => {
        issueToMap = applyFilter(key, filters, issueToMap);
    });

    return issueToMap ? prev.concat([issueToMap]) : prev;
};



class Board {

    constructor(id, lisOfIssues = []) {
        this.id = id;
        const issuesResponse = buildBoard(lisOfIssues);

        Object.assign(this, issuesResponse);

    }

    getIssues(filters = {}) {
        const {
            first,
            last,
            ...rest
        } = filters;

        const reduceFn = shouldApplyExtraFilters(filters) ? issueReduceFn(rest) : (prev, current) => [...prev, current];
        return this.issues.map(issue => issue.isBetween(first, last)).filter(issue => issue !== null).reduce(reduceFn, []).sort((prev, curr) => {
            if (prev.id > curr.id) {
                return 1;
            }
            if (curr.id > prev.id) {
                return -1;
            }
            return 0;
        });
    }


    getLogsByDay(filters = {}) {
       
        const rangeLogs = this.getIssues(filters).map(is => is.worklogs).filter(wl => wl && wl.length > 0).reduce(flat, []);

        let groupedData = {};

        rangeLogs.forEach(wl => {
            const currentDay = wl.started.format('YYYY-MM-DD');

            if (!groupedData[currentDay]) {
                groupedData[currentDay] = [];
            }
            groupedData[currentDay].push(wl);
        });

        return groupedData;
    }

    getIssue(key) {
        return this.issues.find(issue => typeof key === typeof 1 ? issue.id === key : issue.name === key);
    }

    getUsers() {
        return this.users;
    }

    getIssueTypes() {
        return this.types;
    }

    getIssueStatus() {
        return this.status;
    }
    
}

module.exports = Board;