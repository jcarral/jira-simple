class User {
    constructor(data = {}) {
        const { name, id, accountId = '', email, emailAddress = '', displayName = '' } = data;

        this.id = id || accountId;
        this.name = name || displayName;
        this.email = email || emailAddress;
        this.displayName = displayName;

    }

    toString(){
        return `${this.name} ${(this.email !== '') ? this.email : ''}`;
    }

    is(username) {
        return this.name === username;
    }
}


module.exports = User;