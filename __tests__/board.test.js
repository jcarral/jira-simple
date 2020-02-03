require('dotenv-defaults').config()

const { JiraClient, Board } = require('../src');


let board;


const loadBoard = async () => {
    
    const client = new JiraClient({	
        host: process.env.JIRAHOST,	
        username: process.env.JIRANAME,	
        password: process.env.JIRAPWD,	
    });

    board = await client.getBoard('SMC');	

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
    it('Check issues in december', async () => {
        
        const issues = board.getIssues({ first: '2019-12-01', last: '2019-12-31' });
        expect(issues).not.toBeNull();
        expect(issues).not.toHaveLength(0);

        issues.forEach(issue => checkIssue(issue));
    });
});