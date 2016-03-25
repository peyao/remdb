var Remdb = function() {
    this._db = {};
    this._valueCount = {};      // For NUMEQUALTO O(1) access.
    this._transactions = [];
};

// Basic API
Remdb.prototype.SET = function(key, value) {
    if (this._transactions.length) {
        var lastIndex = this._transactions.length - 1;
        this._transactions[lastIndex].db[key] = value;

        // Increment transaction valueCount
        this._transactions[lastIndex].valueCount[value] =
            (this._transactions[lastIndex].valueCount[value] + 1) || 1;
    } else {
        this._db[key] = value;

        // Increment valueCount
        this._valueCount[value] = (this._valueCount[value] + 1) || 1;
    }
};

Remdb.prototype.GET = function(key) {
    var workingDB = this._db;
    if (this._transactions.length) {
        workingDB = this._getTransactionDB();
    }
    return workingDB[key] || 'NULL';
};

Remdb.prototype.UNSET = function(key) {
    var value;
    if (this._transactions.length) {
        var lastIndex = this._transactions.length - 1;
        value = this._transactions[lastIndex].db[key];
        this._transactions[lastIndex].db[key] = null;

        this._decrementValueCount(this._transactions[lastIndex].valueCount, value);
    } else {
        value = this._db[key];
        this._db[key] = null;

        this._decrementValueCount(this._valueCount, value);
    }
};

Remdb.prototype.CLEAR = function() {
    this._db = {};
    this._valueCount = {};
    this._transactions = [];
};

Remdb.prototype.NUMEQUALTO = function(value) {
    var workingValueCount = this._valueCount;
    if (this._transactions.length) {
        workingValueCount = this._getTransactionValueCount();
    }
    console.log('workingValueCount: ', workingValueCount);
    return workingValueCount[value] || 0;
};

Remdb.prototype.BEGIN = function() {
    // For each new transaction, we push a new temp db onto this._transactions.
    this._transactions.push({
        db: {},
        valueCount: {},
    });
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
        Object.assign(this._db, this._transactions[i].db);
        //Object.assign(this._valueCount, this._transactions.valueCount[i]);

        // Sum up transaction valueCount
        this._valueCount = this._transactions.reduce(
            function(prevT, currT) {
                for (var value in currT.valueCount) {
                    prevT.valueCount[value] += currT.valueCount[value];
                }
                return prevT;
            },
            { valueCount: this._valueCount }
        ).valueCount;
    }
    this._transactions = [];
};

// Private methods
Remdb.prototype._getTransactionDB = function() {
    var transactionDB = Object.assign({}, this._db);
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(transactionDB, this._transactions[i].db);
    }
    return transactionDB;
};
Remdb.prototype._getTransactionValueCount = function() {
    var transactionValueCount = Object.assign({}, this._valueCount);
    for (var i = 0; i < this._transactions.length; i++) {
        Object.assign(transactionValueCount, this._transactions[i].valueCount);
    }
    return transactionValueCount;
};
Remdb.prototype._decrementValueCount = function(valueCount, value) {
    if (valueCount[value] && valueCount[value] > 0) {
        valueCount[value]--;
    } else {
        valueCount[value] = 0;
    }
};

module.exports = new Remdb();
