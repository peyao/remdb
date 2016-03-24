var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var cli = function(remdb) {
    rl.setPrompt('remdb> ');
    rl.prompt();

    rl.on('line', function(line) {
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
            if (line !== '') {
                console.log('INVALID INPUT');
            }
            break;
        }
        rl.prompt();
    });
};

module.exports = cli;
