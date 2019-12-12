const moment = require('moment');


class Time {

    constructor(seconds) {
        this.seconds = seconds;
    }

    getHours(){
        return moment.utc(this.seconds*1000).format('DD HH:mm:ss')
    }

};

module.exports = Time;