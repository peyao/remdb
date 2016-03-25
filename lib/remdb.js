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
    this._db = {};              // Main storage
    this._transactions = [];    // Temporary transaction storage
    this._count = {};           // Keeps track of occurrences of each value
    this._tCounts = [];         // Temporary transaction value count
};

/**
* SET
* ---
* Saves a key value pair into _db. It keeps track of the value count within
* _count and _tCounts for a more efficient NUMEQUALTO .
*/
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

/**
* GET
* ---
* Returns a value associated with the input key. Uses _getTransactionDB() to
* get a temporary db with transactions applied.
*/
Remdb.prototype.GET = function(key) {
    var workingDB = this._getTransactionDB();
    return workingDB[key] || 'NULL';
};

/**
* UNSET
* -----
* Unsets a key (sets its value to null). This is either applied to the latest
* _transaction or the current _db if there are no transactions. Updates _count
* and _tCounts for a more efficient NUMEQUALTO.
*/
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

/**
* NUMEQUALTO
* ----------
* Returns number of occurrences of a value in the database.
*
* Complexity is relatively low as counts are kept updated in _count and _tCounts
* and is retrieved with _getTCounts();
*/
Remdb.prototype.NUMEQUALTO = function(value) {
    var workingCount = this._getTCounts();
    return workingCount[value];
};

/**
* BEGIN
* -----
* Pushes a new transaction onto _transactions and _tCounts.
*/
Remdb.prototype.BEGIN = function() {
    // For each new transaction, we push a new temp db onto this._transactions.
    this._transactions.push({});
    this._tCounts.push({});
};


/**
* ROLLBACK
* --------
* Undo the latest transaction. Any commands done since the last BEGIN are undone.
*
* Returns 'NO TRANSACTION' if there are no transactions to roll back.
*/
Remdb.prototype.ROLLBACK = function() {
    // Remove the latest transaction.
    if (this._transactions.pop() && this._tCounts.pop()) {
        return 0;
    }
    return 'NO TRANSACTION';
};

/**
* COMMIT
* ------
* Applies all _transactions to _db and all _tCounts to _count. Collapses both
* _transactions and _tCounts afterwards (resets them).
*
* Returns 'NO TRANSACTION' if there are no transactions to apply.
* Returns 0  and applies transactions otherwise.
*/
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

/**
* CLEAR
* -----
* Clears the database. Resets all the values so it's like you started over.
*/
Remdb.prototype.CLEAR = function() {
    this._db = {};
    this._transactions = [];
    this._count = {};
    this._tCounts = [];
};

/**
* (PRIVATE) _getTransactionDB()
* -----------------------------
* Returns a temporary database that is the accumulation of all current
* transactions, applied to _db.
*/
Remdb.prototype._getTransactionDB = function() {
    var transactionDB = Object.assign({}, this._db);

    // Only iterates through modifications made WITHIN transactions.
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(transactionDB, this._transactions[i]);
    }
    return transactionDB;
};

/**
* (PRIVATE) _getTCounts()
* -----------------------
* Returns changes to the counts of values during transaction operations, applied
* to _count.
*/
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
