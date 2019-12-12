class User {
    constructor(data = {}) {
        const { name, id, email = '' } = data;

        this.id = id;
        this.name = name;
        this.email = email;

    }

    toString(){
        return `${this.name} ${(this.email !== '') ? this.email : ''}`;
    }
}


module.exports = User;