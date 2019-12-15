const { Auth } = require('../auth');

module.exports = {
    getIssues : (boardId, opts) => Auth.get(boardId, opts),
};