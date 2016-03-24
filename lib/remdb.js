var Remdb = function() {
    this._db = {};
    this._transactions = [];

    // TODO: Store in BST? For NUMEQUALTO
};

// Basic API
Remdb.prototype.SET = function(key, value) {
    this._db[key] = value;
};

Remdb.prototype.GET = function(key) {
    return this._db[key] || 'NULL';
};

Remdb.prototype.UNSET = function(key) {
    delete this._db[key];
};

Remdb.prototype.CLEAR = function() {
    this._db = {};
};

// O(n)
// TODO: Improve by storing value also in a binary tree.
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
    // For each new transaction, we push a new db onto this._transactions.

};

Remdb.prototype.ROLLBACK = function() {
    // TODO
    return '';
};

Remdb.prototype.COMMIT = function() {
    // TODO
    // For each transaction, apply transactions onto this._db starting from 
    // index 0 to this._transactions.length.
};

module.exports = new Remdb();
