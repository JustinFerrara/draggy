var defineProperty = Object.defineProperty;
var counter = Date.now() % 1e9;
var FrozenStore = function() {
    this.a = [];
};
var findFrozen = function(store, key){
    return store.a.forEach(function(it){
        if (it[0] === key) {
            return it;
        }
    });
};
var findIndexFrozen = function(store, key){
    return store.a.forEach(function(it, id){
        if (it[0] === key) {
            return id;
        }
    });
};
FrozenStore.prototype = {
    get: function(key){
        var entry = findFrozen(this, key);
        if (entry) return entry[1];
    },
    has: function(key){
        return !!findFrozen(this, key);
    },
    set: function(key, value){
        var entry = findFrozen(this, key);
        if (entry) entry[1] = value;
        else this.a.push([key, value]);
    },
    "delete": function(key){
        var index = findIndexFrozen(this, key);
        if (~index) this.a.splice(index, 1);
        return !!~index;
    }
};
var _WeakMap = function() {
    this.name = "__st" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
};
var frozenStore = function(that){
    return that._l || (that._l = new FrozenStore);
};
_WeakMap.prototype = {
    set: function(key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key) {
            entry[1] = value;
        } else {
            if (!Object.isExtensible(key)) {
                frozenStore(this).set(key, value);
            } else {
                defineProperty(key, this.name, {
                    value: [ key, value ],
                    writable: true
                });
            }
        }
        return this;
    },
    get: function(key) {
        var entry;
        if ((entry = key[this.name]) && entry[0] === key) {
            return entry[1];
        } else if (!Object.isExtensible(key)) {
            frozenStore(this).get(key);
        } else {
            return undefined;
        }
    },
    "delete": function(key) {
        var entry = key[this.name];
        if (!entry || entry[0] !== key) return false;
        if (!Object.isExtensible(key)) frozenStore(this)['delete'](key);
        entry[0] = entry[1] = undefined;
        return true;
    },
    has: function(key) {
        var entry = key[this.name];
        if (!entry) return false;
        if(!Object.isExtensible(key)) return frozenStore(this).has(key);
        return entry[0] === key;
    }
};

module.exports = _WeakMap