require('dotenv-defaults').config();

class Author {

    constructor(data){
        const { name, displayName } = data;
        this.username = name;
        this.name = displayName;

    }



}

module.exports = Author;