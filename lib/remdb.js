/**
* remdb API
* ---------
* SET(key, value)       : Save a value with a key.
* GET(key)              : Retrieve a value by key.
* UNSET(key)            : Unset a key, sets its value to null.
* NUMEQUALTO(value)     : Get number of keys with a certain value.
* BEGIN()               : Start a new transaction.
* ROLLBACK()            : Collapse latest transaction.
* COMMIT()              : Apply changes made in all transactions, then collapse them.
* CLEAR()               : Resets all Remdb fields.
*/

var Remdb = function() {
    this._db = {};
    this._transactions = [];
    this._count = {};
    this._tCounts = [];
};

Remdb.prototype.SET = function(key, value) {
    if (this._transactions.length) {
        var last = this._transactions.length - 1;
        this._transactions[last][key] = value;
        this._tCounts[last][value] = (this._tCounts[last][value] + 1) || 1;
    } else {
        this._db[key] = value;
        this._count[value] = (this._count[value] + 1) || 1;
    }
};

Remdb.prototype.GET = function(key) {
    var workingDB = this._getTransactionDB();
    return workingDB[key] || 'NULL';
};

Remdb.prototype.UNSET = function(key) {
    var value = this._db[key];

    if (this._transactions.length) {
        var last = this._transactions.length - 1;
        this._transactions[last][key] = null;
        this._tCounts[last][value] = (this._tCounts[last][value] - 1) || (-1);
    } else {
        this._db[key] = null;
        this._count[value] = (this._count[value] - 1) || (-1);
    }
};

Remdb.prototype.NUMEQUALTO = function(value) {
    var workingCount = this._getTCounts();
    return workingCount[value];
};

Remdb.prototype.BEGIN = function() {
    // For each new transaction, we push a new temp db onto this._transactions.
    this._transactions.push({});
    this._tCounts.push({});
};

Remdb.prototype.ROLLBACK = function() {
    // Remove the latest transaction.
    if (this._transactions.pop() && this._tCounts.pop()) {
        return 0;
    }
    return 'NO TRANSACTION';
};

Remdb.prototype.COMMIT = function() {
    if (!this._transactions.length) {
        return 'NO TRANSACTION';
    }

    // For each _transaction & _tCount, merge into _db and _count.
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(this._db, this._transactions[i]);
        for (var value in this._tCounts[i]) {
            this._count[value] += this._tCounts[i][value];
        }
    }
    this._transactions = [];
    this._tCounts = [];
    return 0;
};

Remdb.prototype.CLEAR = function() {
    this._db = {};
    this._transactions = [];
    this._count = {};
    this._tCounts = [];
};

Remdb.prototype._getTransactionDB = function() {
    var transactionDB = Object.assign({}, this._db);

    // Only iterates through modifications made WITHIN transactions.
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(transactionDB, this._transactions[i]);
    }
    return transactionDB;
};
Remdb.prototype._getTCounts = function() {
    var counts = Object.assign({}, this._count);

    // Only iterates through values modified WITHIN transactions.
    for (var i = 0; i < this._tCounts.length; i++) {
        for (var value in this._tCounts[i]) {
            counts[value] += this._tCounts[i][value];
        }
    }
    return counts;
};

module.exports = Remdb;
