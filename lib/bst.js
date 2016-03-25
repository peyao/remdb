// Adapted BST.prototype.insert from:
// https://khan4019.github.io/front-end-Interview-Questions/bst.html

/**
* API
* ---
* insert(key, value) : Inserts a node.
* delete(key) : Deletes a node, does nothing if key not found.
* search(key) : Returns value node with key, null if not found.
*/

var BST = function() {
    this._root = null;
};

var Node = function(key, value) {
    this._key = key;
    this._value = value;
    this._left = null;
    this._right = null;
};

BST.prototype.insert = function(key, value) {
    var root = this._root;
    if (!root) {
        this._root = new Node(key, value);
        return;
    }

    var currentNode = root;
    var newNode = new Node(key, value);

    while (currentNode) {
        if (key === currentNode._key) {
            currentNode._value = value;
            break;
        } else if (key < currentNode._key) {
            if (!currentNode._left) {
                currentNode._left = newNode;
                break;
            } else {
                currentNode = currentNode._left;
            }
        } else {
            if (!currentNode._right) {
                currentNode._right = newNode;
                break;
            } else {
                currentNode = currentNode._right;
            }
        }
    }
};

BST.prototype.search = function(key) {
    var root = this._root;
    if (!root) {
        return null;
    }

    var currentNode = root;

    while (currentNode) {
        if (key === currentNode._key) {
            return currentNode._value;
        } else if (key < currentNode._key) {
            currentNode = currentNode._left;
        } else {
            currentNode = currentNode._right;
        }
    }
    return null;
};

BST.prototype.delete = function(key) {
    var root = this._root;
    if (!root) {
        return;
    } else if (key === root._key) {
        this._root = null;
        return;
    }

    var currentNode = root;

    while (currentNode) {
        if (key < currentNode._key) {
            if (key === currentNode._left._key) {
                currentNode._left = null;
                break;
            }
            currentNode = currentNode._left;
        } else {
            if (key === currentNode._right._key) {
                currentNode._right = null;
                break;
            }
            currentNode = currentNode._right;
        }
    }
};

module.exports = BST;
