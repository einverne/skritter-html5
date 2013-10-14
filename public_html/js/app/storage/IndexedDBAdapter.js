/**
 * @module Skritter
 * @submodule Storage
 * @param Storage
 * @author Joshua McFarland
 */
define([
    'storage/Storage',
    'jquery.indexeddb'
], function(Storage) {
    /**
     * A data adapter for IndexedDB which uses the a jQuery plugin written by nparashuram.
     * It extends the Storage class to get the generic database structure and version.
     * https://github.com/axemclion/jquery-indexeddb/
     * 
     * @class IndexedDBAdapter
     * @extends Storage
     * @constructor
     */
    IndexedDBAdapter.prototype = new Storage();
    IndexedDBAdapter.constructor = IndexedDBAdapter;
    function IndexedDBAdapter() {
    }

    /**
     * @method clear
     * @param {Function} callback Returns once the table or tables have been cleared
     * @param {String} tableName An options parameter to clear a specific table
     */
    IndexedDBAdapter.prototype.clear = function(callback, tableName) {
        if (tableName) {
            var promise = $.indexedDB(this.name).objectStore(tableName).each(function(item) {
                item.delete();
                return true;
            });
            promise.fail(function(error) {
                console.error(error);
            });
            promise.done(function() {
                callback();
            });
        } else {
            var position = 0;
            var tables = this.getTableNames();
            for (var i in tables) {
                $.indexedDB(this.name).objectStore(tables[i]).each(function(item) {
                    item.delete();
                    return true;
                }).then(function() {
                    position++;
                    if (position >= tables.length)
                        callback();
                }, function(error) {
                    console.error(error);
                });
            }
        }
    };

    /**
     * @method deleteDatabase
     * @param {Function} callback Returns once the open database has been successfully deleted
     */
    IndexedDBAdapter.prototype.deleteDatabase = function(callback, databaseName) {
        var promise;
        if (databaseName) {
            promise = $.indexedDB(databaseName).deleteDatabase();
        } else {
            promise = $.indexedDB(this.name).deleteDatabase();
        }
        promise.fail(function(error) {
            console.error(error);
        });
        promise.done(function() {
            if (typeof callback === 'function')
                callback();
        });
    };

    /**
     * @method getItem
     * @param {String} tableName The name of the table
     * @param {String} key The primary key or keys
     * @param {Function} callback Returns a single row as an object
     */
    IndexedDBAdapter.prototype.getItem = function(tableName, key, callback) {
        var promise = $.indexedDB(this.name).objectStore(tableName).get(key);
        promise.fail(function(error) {
            console.error(error);
        });
        promise.done(function(event) {
            callback(event);
        });
    };

    /**
     * @method getItems
     * @param {String} tableName
     * @param {Function} callback
     * @param {String} keys
     */
    IndexedDBAdapter.prototype.getItems = function(tableName, callback, keys) {
        var items = [];
        var promise = $.indexedDB(this.name).objectStore(tableName).each(function(item) {
            if (!keys || _.contains(keys, item.key)) {
                items.push(item.value);
            }
        });
        promise.fail(function(error) {
            console.error(error);
        });
        promise.done(function() {
            callback(items);
        });
    };

    /**
     * @method openDatabase
     * @param {String} databaseName The name of the database
     * @param {Function} callback Returns the successfully created database object
     */
    IndexedDBAdapter.prototype.openDatabase = function(databaseName, callback) {
        var self = this;
        var promise = $.indexedDB(databaseName, {
            version: this.version,
            upgrade: function(transaction) {
            },
            schema: this.schemaIndexedDB
        });
        promise.fail(function(error) {
            console.error(error);
            self.deleteDatabase(function() {
                self.openDatabase(databaseName, function() {
                    callback();
                });
            }, databaseName);           
        });
        promise.done(function(event) {
            self.database = event;
            self.name = event.name;
            if (typeof callback === 'function')
                callback(event);
        });
    };

    /**
     * @method removeItem
     * @param {String} tableName
     * @param {String} key
     * @param {Function} callback
     */
    IndexedDBAdapter.prototype.removeItem = function(tableName, key, callback) {
        var promise = $.indexedDB(this.name).objectStore(tableName, true).remove(key);
        promise.fail(function(error) {
            console.error(error);
        });
        promise.done(function(event) {
            callback(event);
        });
    };

    /**
     * @method setItem
     * @param {String} tableName
     * @param {Object} item An object to be saved or updated
     * @param {Function} callback
     */
    IndexedDBAdapter.prototype.setItem = function(tableName, item, callback) {
        var promise = $.indexedDB(this.name).objectStore(tableName, true).put(item);
        promise.fail(function(error) {
            console.error(error);
        });
        promise.done(function(event) {
            callback(event);
        });
    };

    /**
     * @method setItems
     * @param {String} tableName
     * @param {Array} items An array of item objects
     * @param {Function} callback
     */
    IndexedDBAdapter.prototype.setItems = function(tableName, items, callback) {
        var events = [];
        var position = 0;
        for (var i in items) {
            var item = items[i];
            this.setItem(tableName, item, function(event) {
                position++;
                events.push(event);
                if (position === items.length) {
                    callback(events);
                }
            });
        }
    };


    return IndexedDBAdapter;
});