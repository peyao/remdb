'use strict';

var Remdb = function() {
    this._db = {};
};

// Basic API
Remdb.prototype.SET = (key, value) => {
    this._db[key] = value;
};

Remdb.prototype.GET = key => {
    return this._db[key] || 'NULL';
};

Remdb.prototype.UNSET = key => {
    // TODO
};

Remdb.prototype.NUMEQUALTO = value => {
    // TODO
};

Remdb.prototype.BEGIN = _ => {
    // TODO
};

Remdb.prototype.ROLLBACK = _ => {
    // TODO
};

Remdb.prototype.COMMIT = _ => {
    // TODO
};

module.exports = new Remdb();
