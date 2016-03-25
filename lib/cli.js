var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
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
        var invalidParams = function(num) {
            if (params.length !== num) {
                console.log('INVALID INPUT');
                return true;
            }
            return false;
        };

        switch (params[0]) {
        case 'SET':
            if (invalidParams(3)) break;
            remdb.SET(params[1], params[2]);
            break;
        case 'GET':
            if (invalidParams(2)) break;
            console.log(remdb.GET(params[1]));
            break;
        case 'UNSET':
            if (invalidParams(2)) break;
            remdb.UNSET(params[1]);
            break;
        case 'NUMEQUALTO':
            if (invalidParams(2)) break;
            console.log(remdb.NUMEQUALTO(params[1]));
            break;
        case 'BEGIN':
            if (invalidParams(1)) break;
            remdb.BEGIN();
            break;
        case 'ROLLBACK':
            if (invalidParams(1)) break;
            var retVal = remdb.ROLLBACK();
            if (retVal) {
                console.log(retVal);
            }
            break;
        case 'COMMIT':
            if (invalidParams(1)) break;
            var retVAl = remdb.COMMIT();
            if (retVal) {
                console.log(retVal);
            }
            break;
        case 'END':
            if (invalidParams(1)) break;
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
