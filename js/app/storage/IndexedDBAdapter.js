/**
 * @module Skritter
 * @submodule Storage
 * @param Storage
 * @author Joshua McFarland
 */
define([
    'storage/Storage',
    'jquery.indexeddb',
    'indexeddb.shim'
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
     * @param {String} databaseName
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
            schema: {
                1: function(transaction) {
                    //decomps table
                    var decomps = transaction.createObjectStore('decomps', {keyPath: 'writing'});
                    decomps.createIndex('atomic', 'atomic');
                    decomps.createIndex('Children', 'Children');
                    //items table
                    var items = transaction.createObjectStore('items', {keyPath: 'id'});
                    items.createIndex('lang', 'lang');
                    items.createIndex('part', 'part');
                    items.createIndex('vocabIds', 'vocabIds');
                    items.createIndex('style', 'style');
                    items.createIndex('timeStudied', 'timeStudied');
                    items.createIndex('next', 'next');
                    items.createIndex('last', 'last');
                    items.createIndex('interval', 'interval');
                    items.createIndex('vocabListIds', 'vocabListIds');
                    items.createIndex('sectionIds', 'sectionIds');
                    items.createIndex('reviews', 'reviews');
                    items.createIndex('successes', 'successes');
                    items.createIndex('created', 'created');
                    items.createIndex('changed', 'changed');
                    items.createIndex('previousSuccess', 'previousSuccess');
                    items.createIndex('previousInterval', 'previousInterval');
                    //log table
                    var log = transaction.createObjectStore('log', {keyPath: 'id', autoIncrement: true});
                    log.createIndex('userId', 'userId');
                    log.createIndex('timestamp', 'timestamp');
                    log.createIndex('data', 'data');
                    //reviews table
                    var reviews = transaction.createObjectStore('reviews', {keyPath: ['itemId', 'submitTime']});
                    reviews.createIndex('score', 'score');
                    reviews.createIndex('bearTime', 'bearTime');
                    reviews.createIndex('reviewTime', 'reviewTime');
                    reviews.createIndex('thinkingTime', 'thinkingTime');
                    reviews.createIndex('currentInterval', 'currentInterval');
                    reviews.createIndex('actualInterval', 'actualInterval');
                    reviews.createIndex('newInterval', 'newInterval');
                    reviews.createIndex('wordGroup', 'wordGroup');
                    reviews.createIndex('previousInterval', 'previousInterval');
                    reviews.createIndex('previousSuccess', 'previousSuccess');
                    //sentences table
                    var sentences = transaction.createObjectStore('sentences', {keyPath: 'id'});
                    sentences.createIndex('containedVocabIds', 'containedVocabIds');
                    sentences.createIndex('definitions', 'definitions');
                    sentences.createIndex('lang', 'lang');
                    sentences.createIndex('reading', 'reading');
                    sentences.createIndex('starred', 'starred');
                    sentences.createIndex('style', 'style');
                    sentences.createIndex('toughness', 'toughness');
                    sentences.createIndex('toughnessString', 'toughnessString');
                    sentences.createIndex('writing', 'writing');
                    //strokes table
                    var strokes = transaction.createObjectStore('strokes', {keyPath: 'rune'});
                    strokes.createIndex('lang', 'lang');
                    strokes.createIndex('strokes', 'strokes');
                    //srsconfigs table
                    var srsconfigs = transaction.createObjectStore('srsconfigs', {keyPath: ['part', 'lang']});
                    srsconfigs.createIndex('initialRightInterval', 'initialRightInterval');
                    srsconfigs.createIndex('initialWrongInterval', 'initialWrongInterval');
                    srsconfigs.createIndex('rightFactors', 'rightFactors');
                    srsconfigs.createIndex('wrongFactors', 'wrongFactors');
                    //vocabs table
                    var vocabs = transaction.createObjectStore('vocabs', {keyPath: 'id'});
                    vocabs.createIndex('writing', 'writing');
                    vocabs.createIndex('reading', 'reading');
                    vocabs.createIndex('definitions', 'definitions');
                    vocabs.createIndex('customDefinitions', 'customDefinitions');
                    vocabs.createIndex('lang', 'lang');
                    vocabs.createIndex('audio', 'audio');
                    vocabs.createIndex('rareKanji', 'rareKanji');
                    vocabs.createIndex('toughness', 'toughness');
                    vocabs.createIndex('toughnessString', 'toughnessString');
                    vocabs.createIndex('mnemonic', 'mnemonic');
                    vocabs.createIndex('starred', 'starred');
                    vocabs.createIndex('style', 'style');
                    vocabs.createIndex('changed', 'changed');
                    vocabs.createIndex('bannedParts', 'bannedParts');
                    vocabs.createIndex('containedVocabIds', 'containedVocabIds');
                    vocabs.createIndex('heisigDefinition', 'heisigDefinition');
                    vocabs.createIndex('sentenceId', 'sentenceId');
                    vocabs.createIndex('topMnemonic', 'topMnemonic');
                }
            }
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
        var promise = $.indexedDB(this.name).objectStore(tableName, true).delete(key);
        promise.fail(function(error) {
            console.error(key, error);
        });
        promise.done(function(event) {
            callback(event);
        });
    };

    /**
     * @method removeItems
     * @param {String} tableName
     * @param {Array} items
     * @param {Function} callback
     */
    IndexedDBAdapter.prototype.removeItems = function(tableName, items, callback) {
        var events = [];
        var position = 0;
        for (var i in items) {
            var item = items[i];
            this.removeItem(tableName, item, function(event) {
                position++;
                events.push(event);
                if (position >= items.length) {
                    callback(events);
                }
            });
        }
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