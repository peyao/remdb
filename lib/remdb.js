'use strict';

var Remdb = () => {
    this._db = {};

    // TODO: Store in BST? For NUMEQUALTO
};

// Basic API
Remdb.prototype.SET = (key, value) => {
    this._db[key] = value;
};

Remdb.prototype.GET = key => {
    return this._db[key] || 'NULL';
};

Remdb.prototype.UNSET = key => {
    delete this._db[key];
};

// O(n)
// TODO: Improve by storing value also in a binary tree.
Remdb.prototype.NUMEQUALTO = value => {
    var numEqualTo = 0;
    for (var key in this._db) {
        if (this._db[key] === value) {
            numEqualTo++;
        }
    }
    return numEqualTo;
};

Remdb.prototype.BEGIN = () => {
    // TODO
};

Remdb.prototype.ROLLBACK = () => {
    // TODO
};

Remdb.prototype.COMMIT = () => {
    // TODO
};

module.exports = new Remdb();
