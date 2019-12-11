require('dotenv-defaults').config();
const Author = require('./Author');

class Worklog {


    constructor(data) {
        const { id, timeSpentSeconds, author } = data;

        this.id = id;
        this.seconds = timeSpentSeconds;
        this.author = new Author(author);
    }


};  


module.exports = Worklog;