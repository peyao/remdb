# remdb 
[![Code Climate](https://codeclimate.com/github/peyao/remdb/badges/gpa.svg)](https://codeclimate.com/github/peyao/remdb)

A simple in-memory database that can be used as a **module** or interacted as a **stdin - stdout** CLI application.

# How do I use the CLI?

    npm install
    node bin/remdb
    node bin/remdb < test/test_cli_1.txt

# How do I use it as a module?

    npm install

Then in your file:

    var Remdb = require('../lib/remdb');
    var remdb = new Remdb();

    remdb.SET('a', 10);
    var aVal = remdb.GET('a');

# Interface

### SET key value
Sets the **key** to **value**.

    remdb.SET('a', 10);

### GET key
Get the **value** of **key**. If **key** has not yet been set, will return *NULL*.

    remdb.GET('a');

### UNSET key
Unsets the **key**'s **value**, it will become null.

    remdb.UNSET('a');

### NUMEQUALTO value
Get number of **key**s that are currently set to **value**.

    remdb.NUMEQUALTO(10);

### CLEAR
*[Module]* Clears the database. Only available when included as a module.

    remdb.CLEAR();

### END
*[CLI]* Exits remdb. Only available in CLI.


# Transaction Commands

### BEGIN
Open a new transaction block. Transaction blocks can be nested.

    remdb.BEGIN();

### ROLLBACK
Collapse latest transaction block (undo what was set after the latest BEGIN).

    remdb.ROLLBACK();

### COMMIT
Apply and collapse all transaction blocks.

    remdb.COMMIT();


# Running Tests
Tests are located in **test/test.js** and uses *Mocha* with *Chai*.

    npm install
    npm test
