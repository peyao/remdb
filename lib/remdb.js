var BST = require('./bst');

var Remdb = function() {
    this._db = {};
    this._transactions = [];
};

// Basic API
Remdb.prototype.SET = function(key, value) {
    if (this._transactions.length) {
        this._transactions[this._transactions.length - 1][key] = value;
    } else {
        this._db[key] = value;
    }
};

Remdb.prototype.GET = function(key) {
    var workingDB = this._getTransactionDB();
    return workingDB[key] || 'NULL';
};

Remdb.prototype.UNSET = function(key) {
    if (this._transactions.length) {
        this._transactions[this._transactions.length - 1][key] = null;
    } else {
        delete this._db[key];
    }
};

Remdb.prototype.CLEAR = function() {
    this._db = {};
    this._transactions = [];
};

// TODO: Improve by storing value also in a binary tree.
// O(n) right now...
Remdb.prototype.NUMEQUALTO = function(value) {
    var numEqualTo = 0;
    var workingDB = this._getTransactionDB();
    for (var key in workingDB) {
        if (workingDB[key] === value) {
            numEqualTo++;
        }
    }
    return numEqualTo;
};

Remdb.prototype.BEGIN = function() {
    // For each new transaction, we push a new temp db onto this._transactions.
    this._transactions.push({});
};

Remdb.prototype.ROLLBACK = function() {
    // Remove the latest transaction
    if (this._transactions.pop()) {
        return 0;
    }
    return 'NO TRANSACTION';
};

Remdb.prototype.COMMIT = function() {
    // For each transaction, merge transactions onto this._db starting from
    // index 0 to this._transactions.length.
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(this._db, this._transactions[i]);
    }
    this._transactions = [];
};

Remdb.prototype._getTransactionDB = function() {
    var transactionDB = Object.assign({}, this._db);
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(transactionDB, this._transactions[i]);
    }
    return transactionDB;
};

module.exports = Remdb;
