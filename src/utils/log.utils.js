const fs = require('fs');
const util = require('util');

const log = (type, message, cli) => {
    if(cli){
        console.log(message);
    } else {
        fs.createWriteStream(`${__dirname}/${type}.log`, {flags : 'a'}).write(message + '\n');
    }
};


module.exports = {

    info : (message) => log('info', message, false),
    error : (message) => log('error', message, false),
    debug : (message) => log('debug', message, false),
    log : (message) => log('log', message, true)

}