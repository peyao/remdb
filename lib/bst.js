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
    this.root = null;
};

var Node = function(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
};

BST.prototype.insert = function(key, value) {
    var root = this.root;
    if (!root) {
        this.root = new Node(key, value);
        return;
    }

    var currentNode = root;
    var newNode = new Node(key, value);

    while (currentNode) {
        if (key === currentNode.key) {
            currentNode.value = value;
            break;
        } else if (key < currentNode.key) {
            if (!currentNode.left) {
                currentNode.left = newNode;
                break;
            } else {
                currentNode = currentNode.left;
            }
        } else {
            if (!currentNode.right) {
                currentNode.right = newNode;
                break;
            } else {
                currentNode = currentNode.right;
            }
        }
    }
};

BST.prototype.search = function(key) {
    var root = this.root;
    if (!root) {
        return null;
    }

    var currentNode = root;

    while (currentNode) {
        if (key === currentNode.key) {
            return currentNode.value;
        } else if (key < currentNode.key) {
            currentNode = currentNode.left;
        } else {
            currentNode = currentNode.right;
        }
    }
    return null;
};

BST.prototype.delete = function(key) {
    var root = this.root;
    if (!root) {
        return;
    } else if (key === root.key) {
        this.root = null;
        return;
    }

    var currentNode = root;

    while (currentNode) {
        if (key < currentNode.key) {
            if (key === currentNode.left.key) {
                currentNode.left = null;
                break;
            }
            currentNode = currentNode.left;
        } else {
            if (key === currentNode.right.key) {
                currentNode.right = null;
                break;
            }
            currentNode = currentNode.right;
        }
    }
};

module.exports = BST;
