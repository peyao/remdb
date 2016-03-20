# remdb

A simple in-memory database that accepts input from **stdin** and outputs to **stdout**. It sounds cool but it's just a glorified JS object wrapped with an API.

# How do I do things?

### SET name value
Sets the key **name** to value **value**.

### GET name
Prints out the value of **name** to *stdout*. If **name** has not yet been set, will output *NULL*.

### UNSET name
Unsets the key **name**, **name** will become undefined.

### NUMEQUALTO value
Print out key names that are currently set to **value**.

### END
Exits remdb.


# Transaction Commands

### BEGIN

### ROLLBACK

### COMMIT
