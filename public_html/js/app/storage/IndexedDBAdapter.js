/**
 * @module Skritter
 * @submodule Storage
 * @author Joshua McFarland
 */
define([
    'indexeddb.shim',
    'jquery.indexeddb'
], function() {
    /**
     * @class IndexedDBAdapter
     * @constructor
     */
    function IndexedDBAdapter() {
        this.database = null;
        this.databaseName = null;
        this.databaseVersion = 1;
    }

    /**
     * @method count
     * @param {String} tableName
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.count = function(tableName, callback) {
        var promise = $.indexedDB(this.databaseName).objectStore(tableName).count();
        promise.done(function(count) {
            callback(count);
        });
        promise.fail(function(error) {
            console.error(tableName, error);
        });
    };

    /**
     * @method deleteAllDatabases
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.deleteAllDatabases = function(callback) {
        var position = 0;
        if (window.indexedDB.webkitGetDatabaseNames) {
            var request = window.indexedDB.webkitGetDatabaseNames();
            request.onsuccess = function(event) {
                next();
                function next() {
                    var promise = $.indexedDB(event.target.result[position]).deleteDatabase();
                    promise.done(function() {
                        if (position < event.target.result.length) {
                            position++;
                            next();
                        } else {
                            callback();
                        }
                    });
                    promise.fail(function(error) {
                        console.error(error);
                    });
                }
            };
        } else {
            callback();
        }
    };

    /**
     * @method deleteDatabase
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.deleteDatabase = function(callback) {
        var promise = this.database.deleteDatabase();
        promise.done(function() {
            if (typeof callback === 'function')
                callback();
        });
        promise.fail(function(error) {
            console.error(error);
        });
    };

    /**
     * @method openDatabase
     * @param {String} databaseName
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.openDatabase = function(databaseName, callback) {
        var self = this;
        this.databaseName = databaseName;
        var promise = $.indexedDB(this.databaseName, {
            version: 1,
            schema: {
                1: function(transaction) {
                    transaction.createObjectStore('decomps', {keyPath: 'writing'});
                    transaction.createObjectStore('items', {keyPath: 'id'});
                    transaction.createObjectStore('reviews', {keyPath: 'id'});
                    transaction.createObjectStore('sentences', {keyPath: 'id'});
                    transaction.createObjectStore('strokes', {keyPath: 'rune'});
                    transaction.createObjectStore('srsconfigs', {keyPath: 'part'});
                    transaction.createObjectStore('vocabs', {keyPath: 'id'});
                }
            }
        });
        promise.done(function(event) {
            if (event.objectStoreNames.length === 0) {
                self.deleteAllDatabases(callback);
            } else {
                self.database = promise;
                callback();
            }
        });
        promise.fail(function(error) {
            console.error(databaseName, error);
        });
    };

    /**
     * @method getAll
     * @param {String} tableName
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.getAll = function(tableName, callback) {
        var items = [];
        var table = this.database.objectStore(tableName);
        var promise = table.each(function(item) {
            items.push(item.value);
        });
        promise.done(function() {
            callback(items);
        });
        promise.fail(function(error) {
            console.error(tableName, error);
        });
    };

    /**
     * @method getItems
     * @param {String} tableName
     * @param {Arrau} keys
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.getItems = function(tableName, keys, callback) {
        var position = 0;
        var items = [];
        var table = this.database.objectStore(tableName);
        keys = Array.isArray(keys) ? keys : [keys];
        getNext();
        function getNext() {
            if (position < keys.length) {
                var promise = table.get(keys[position]);
                promise.done(function(item) {
                    position++;
                    if (item)
                        items.push(item);
                    getNext();
                });
                promise.fail(function(error) {
                    console.error(tableName, keys[position], error);
                });
            } else {
                callback(items);
            }
        }
    };

    /**
     * @method removeItems
     * @param {String} tableName
     * @param {Array} keys
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.removeItems = function(tableName, keys, callback) {
        var position = 0;
        var table = this.database.objectStore(tableName);
        keys = Array.isArray(keys) ? keys : [keys];
        removeNext();
        function removeNext() {
            if (position < keys.length) {
                var promise = table.delete(keys[position]);
                promise.done(function() {
                    position++;
                    removeNext();
                });
                promise.fail(function(error) {
                    console.error(tableName, keys[position], error);
                });
            } else {
                if (typeof callback === 'function')
                    callback();
            }
        }
    };

    /**
     * @method getSchedule
     * @param {Function} callback
     */
    IndexedDBAdapter.prototype.getSchedule = function(callback) {
        var items = [];
        var table = this.database.objectStore('items');
        var promise = table.each(function(item) {
            if (item.value.vocabIds.length > 0) {
                var splitId = item.value.id.split('-');
                items.push({
                    base: splitId[1] + '-' + splitId[2] + '-' + splitId[3],
                    id: item.value.id,
                    last: (item.value.last) ? item.value.last : 0,
                    next: item.value.next,
                    part: item.value.part,
                    style: item.value.style,
                    vocabIds: item.value.vocabIds
                });
            }
        });
        promise.done(function() {
            callback(items);
        });
        promise.fail(function(error) {
            console.error('schedule', error);
            callback();
        });
    };

    /**
     * @method setItems
     * @param {String} tableName
     * @param {Array} items
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.setItems = function(tableName, items, callback) {
        var position = 0;
        var table = this.database.objectStore(tableName);
        items = Array.isArray(items) ? items : [items];
        setNext();
        function setNext() {
            if (position < items.length) {
                var promise = table.put(items[position]);
                promise.done(function() {
                    position++;
                    setNext();
                });
                promise.fail(function(error) {
                    console.error(tableName, items[position], error);
                });
            } else {
                if (typeof callback === 'function')
                    callback();
            }
        }
    };

    return IndexedDBAdapter;
});