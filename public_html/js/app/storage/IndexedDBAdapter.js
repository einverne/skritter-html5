/**
 * @module Skritter
 * @submodule Storage
 * @author Joshua McFarland
 */
define([
    'jquery.indexeddb'
], function() {
    /**
     * @class IndexedDBAdapter
     * @constructor
     */
    function IndexedDBAdapter() {
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
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.deleteAllDatabases = function() {
         var request = window.indexedDB.webkitGetDatabaseNames();
        request.onsuccess = function(event) {
            for (var i in event.target.result)
                $.indexedDB(event.target.result[i]).deleteDatabase();
        };
    };
    
    /**
     * @method deleteDatabase
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.deleteDatabase = function(callback) {
        var promise = $.indexedDB(this.databaseName).deleteDatabase();
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
                    transaction.createObjectStore('reviews', {keyPath: ['itemId', 'submitTime']});
                    transaction.createObjectStore('sentences', {keyPath: 'id'});
                    transaction.createObjectStore('strokes', {keyPath: 'rune'});
                    transaction.createObjectStore('srsconfigs', {keyPath: ['part', 'lang']});
                    transaction.createObjectStore('vocabs', {keyPath: 'id'});
                }
            }
        });
        promise.done(function(event) {   
            if (event.objectStoreNames.length === 0) {
                self.deleteDatabase(self.openDatabase, self.databaseName, callback);
                return false;
            } else {
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
        var promise = $.indexedDB(this.databaseName).objectStore(tableName).each(function(item) {
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
        var self = this;
        var position = 0;
        var items = [];
        keys = Array.isArray(keys) ? keys : [keys];
        getNext();
        function getNext() {
            if (position < keys.length) {
                var promise = $.indexedDB(self.databaseName).objectStore(tableName).get(keys[position]);
                promise.done(function(item) {
                    position++;
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
    
    IndexedDBAdapter.prototype.getSchedule = function(callback) {
        var schedule = [];
        var promise = $.indexedDB(this.databaseName).objectStore('items').each(function(item) {
            if (item.value.vocabIds.length > 0)
                schedule.push(item.value);
        });
        promise.done(function() {
            console.log(schedule);
            callback(schedule);
        });
        promise.fail(function(error) {
            console.error(error);
        });
    };
    
    /**
     * @method removeItems
     * @param {String} tableName
     * @param {Array} keys
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.removeItems = function(tableName, keys, callback) {
        var self = this;
        var position = 0;
        keys = Array.isArray(keys) ? keys : [keys];
        removeNext();
        function removeNext() {
            if (position < keys.length) {
                var promise = $.indexedDB(self.databaseName).objectStore(tableName).delete(keys[position]);
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
     * @method setItems
     * @param {String} tableName
     * @param {Array} items
     * @param {Function} callback
     * @returns {undefined}
     */
    IndexedDBAdapter.prototype.setItems = function(tableName, items, callback) {
        var self = this;
        var position = 0;
        var setNext = function() {
            if (position < items.length) {
                var promise = $.indexedDB(self.databaseName).objectStore(tableName).put(items[position]);
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
        };
        
        if (items) {
            items = Array.isArray(items) ? items : [items];
            setNext();
        } else {
            callback();
        }
    };

    return IndexedDBAdapter;
});