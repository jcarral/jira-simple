require('dotenv-defaults').config()

const { JiraClient } = require('../src');

const SEARCH_TERM = process.env.TEST_SEARCH_TERM;
const SEARCH_USERNAME = 'jcarral';
const BOARD_NAME = process.env.TEST_BOARD_NAME;
const FILTERS_ISSUES_DATE = {

};

jest.setTimeout(30000);

const loadIssues = async (filters = {}) => {

    const client = new JiraClient({	
        host: process.env.JIRAHOST,	
        username: process.env.JIRANAME,	
        password: process.env.JIRAPWD,	
    });

    return await client.getIssues(BOARD_NAME, filters);
};

const checkIssue = issue => {
    expect(issue).not.toBeNull();
    expect(issue).toHaveProperty('id');
    expect(issue).toHaveProperty('name');
    expect(issue).toHaveProperty('created');
    expect(issue).toHaveProperty('summary');
};

describe('getIssues ', () => {

    it('Get all issues', async () => {
        const issues = await loadIssues({});

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
    });

    it(`Get all issues by date range`, async () => {
        
        const issues = await loadIssues({
            first : '2020-01-01',
            last : '2020-02-29',
        });

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
        
    });


    it('Get issues by username', async () => {
        
        const issues = await loadIssues({
            username : SEARCH_USERNAME,
        });

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
    });


    it(`Get all issues by username and dates`, async () => {

        const issues = await loadIssues({
            first : '2020-01-01',
            last : '2020-02-29',
            username : SEARCH_USERNAME
        });

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));

    });

    it(`Get all issues by username, dates and searchTerm`, async () => {

        const issues = await loadIssues({
            first : '2020-01-01',
            last : '2020-02-29',
            username : SEARCH_USERNAME,
            searchTerm: SEARCH_TERM
        });

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));

    });
});
