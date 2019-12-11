require('dotenv-defaults').config();


const Board = require('./src/models/Board');
const Author = require('./src/models/Author');

const { Auth } = require('./src/auth')

const mainBoard = new Board(2);
const mainUser = new Author({ username : 'jcarral '});

//mainBoard.getAllIssues().then(res => console.log(JSON.stringify(res)));


//mainBoard.getIssuesBetween('2019-12-10', '2019-12-30').then(res => console.log(JSON.stringify(res)))
mainUser.getIssues().then(res => console.log(JSON.stringify(res)))