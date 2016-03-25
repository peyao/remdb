var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

var cli = function(remdb) {
    if (rl.input.isTTY) {
        rl.setPrompt('remdb> ');
    } else {
        rl.setPrompt('');
    }
    rl.prompt();

    rl.on('line', function(line) {
        var params = line.trim().split(" ");

        switch (params[0]) {
        case 'SET':
            if (params.length !== 3) {
                console.log('INVALID INPUT');
                break;
            }
            remdb.SET(params[1], params[2]);
            break;
        case 'GET':
            if (params.length !== 2) {
                console.log('INVALID INPUT');
                break;
            }
            console.log(remdb.GET(params[1]));
            break;
        case 'UNSET':
            if (params.length !== 2) {
                console.log('INVALID INPUT');
                break;
            }
            remdb.UNSET(params[1]);
            break;
        case 'NUMEQUALTO':
            if (params.length !== 2) {
                console.log('INVALID INPUT');
                break;
            }
            console.log(remdb.NUMEQUALTO(params[1]));
            break;
        case 'BEGIN':
            if (params.length !== 1) {
                console.log('INVALID INPUT');
                break;
            }
            remdb.BEGIN();
            break;
        case 'ROLLBACK':
            if (params.length !== 1) {
                console.log('INVALID INPUT');
                break;
            }
            var retVal = remdb.ROLLBACK();
            if (retVal) {
                console.log(retVal);
            }
            break;
        case 'COMMIT':
            if (params.length > 1) {
                console.log('INVALID INPUT');
                break;
            }
            var retVAl = remdb.COMMIT();
            if (retVal) {
                console.log(retVal);
            }
            break;
        case 'END':
            if (params.length > 1) {
                console.log('INVALID INPUT');
                break;
            }
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
