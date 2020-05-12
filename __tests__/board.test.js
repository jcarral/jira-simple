require('dotenv-defaults').config()

const { JiraClient } = require('../src');

const SEARCH_TERM = process.env.TEST_SEARCH_TERM;
const BOARD_NAME = process.env.TEST_BOARD_NAME;

let board;

jest.setTimeout(30000);

const loadBoard = async () => {

    const client = new JiraClient({	
        host: process.env.JIRAHOST,	
        username: process.env.JIRANAME,	
        password: process.env.JIRAPWD,	
    });

    board = await client.getBoard(BOARD_NAME);
};

const checkIssue = issue => {
    expect(issue).not.toBeNull();
    expect(issue).toHaveProperty('id');
    expect(issue).toHaveProperty('name');
    expect(issue).toHaveProperty('created');
    expect(issue).toHaveProperty('summary');
};

beforeAll(async () => await loadBoard());

describe('getBoard ', () => {

    it(`Check all issues`, async () => {

        const issues = board.getIssues({});

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
        
    });


    it('Check issues from december', async () => {
        
        const issues = board.getIssues({ first: '2020-05-01', last: '2020-05-13' });
        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
    });


    it(`Check issue which contains the word "${SEARCH_TERM}"`, async () => {

        const issues = board.getIssues({ searchTerm : SEARCH_TERM });

        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
        issues.forEach(issue => expect(issue.summary.toUpperCase()).toMatch(`${SEARCH_TERM.toUpperCase()}`));

    });
});
