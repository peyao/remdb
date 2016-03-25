var Remdb = function() {
    this._db = {};
    this._transactions = [];

    // TODO: Store in BST? For NUMEQUALTO
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
    var transactionValue;
    if (this._transactions.length) {
        transactionValue = this._transactions[this._transactions.length - 1][key];
    }
    return transactionValue || this._db[key] || 'NULL';
};

Remdb.prototype.UNSET = function(key) {
    if (this._transactions.length) {
        delete this._transactions[this._transactions.length - 1][key];
    } else {
        delete this._db[key];
    }
};

Remdb.prototype.CLEAR = function() {
    this._db = {};
};

// TODO: Improve by storing value also in a binary tree.
// O(n) right now...
Remdb.prototype.NUMEQUALTO = function(value) {
    var numEqualTo = 0;
    for (var key in this._db) {
        if (this._db[key] === value) {
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

module.exports = new Remdb();
