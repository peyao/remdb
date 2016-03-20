'use strict';

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var cli = (remdb) => {
    rl.setPrompt('remdb> ');
    rl.prompt();

    rl.on('line', (line) => {
        var lineSplit = line.trim().split(" ");

        switch (lineSplit[0]) {
        case 'SET':
            // TODO: Throw exceptions
            remdb.SET(lineSplit[1], lineSplit[2]);
            break;
        case 'GET':
            // TODO: Throw exceptions
            console.log(remdb.GET(lineSplit[1]));
            break;
        case 'END':
            process.exit(0);
            break;
        default:
            // TODO: Throw exceptions
            if (line !== '') {
                console.log('Invalid!');
            }
            break;
        }
        rl.prompt();
    });
};

module.exports = cli;
