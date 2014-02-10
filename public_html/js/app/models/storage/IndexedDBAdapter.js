/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    var IndexedDBAdapter = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            IndexedDBAdapter.this = this;
            IndexedDBAdapter.database = null;
            IndexedDBAdapter.databaseName = null;
            IndexedDBAdapter.databaseVersion = 1;
        },
        /**
         * @method count
         * @param {String} tableName
         * @param {Function} callback
         */
        count: function(tableName, callback) {
            var promise = $.indexedDB(IndexedDBAdapter.databaseName).objectStore(tableName).count();
            promise.done(function(count) {
                callback(count);
            });
            promise.fail(function(error) {
                console.error(tableName, error);
            });
        },
        /**
         * @method deleteDatabase
         * @param {Function} callback
         */
        deleteDatabase: function(callback) {
            var promise = IndexedDBAdapter.database.deleteDatabase();
            promise.done(function() {
                if (typeof callback === 'function')
                    callback();
            });
            promise.fail(function(error) {
                console.error(error);
            });
        },
        /**
         * @method openDatabase
         * @param {String} databaseName
         * @param {Function} callback
         */
        openDatabase: function(databaseName, callback) {
            IndexedDBAdapter.databaseName = databaseName;
            var promise = $.indexedDB(IndexedDBAdapter.databaseName, {
                version: IndexedDBAdapter.databaseVersion,
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
                IndexedDBAdapter.database = promise;
                if (event.objectStoreNames.length < 1) {
                    IndexedDBAdapter.this.deleteDatabase(function() {
                        IndexedDBAdapter.this.openDatabase(databaseName, callback);
                    });
                } else {
                    callback();
                }
            });
            promise.fail(function(error) {
                console.error(databaseName, error);
            });
        },
        /**
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         */
        getAll: function(tableName, callback) {
            var items = [];
            var table = IndexedDBAdapter.database.objectStore(tableName);
            var promise = table.each(function(item) {
                items.push(item.value);
            });
            promise.done(function() {
                callback(items);
            });
            promise.fail(function(error) {
                console.error(tableName, error);
                callback(items);
            });
        },
        /**
         * @method getItems
         * @param {String} tableName
         * @param {Arrau} keys
         * @param {Function} callback
         */
        getItems: function(tableName, keys, callback) {
            var position = 0;
            var items = [];
            var table = IndexedDBAdapter.database.objectStore(tableName);
            keys = Array.isArray(keys) ? keys : [keys];
            keys = _.remove(keys, undefined);
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
        },
        /**
         * @method getItemsWhere
         * @param {String} tableName
         * @param {String} attribute
         * @param {String} value
         * @param {Function} callback
         */
        getItemsWhere: function(tableName, attribute, value, callback) {
            var items = [];
            var table = IndexedDBAdapter.database.objectStore(tableName);
            var promise = table.each(function(item) {
                if (item.value[attribute] === value)
                    items.push(item.value);
            });
            promise.done(function() {
                callback(items);
            });
            promise.fail(function(error) {
                console.error(tableName, error);
            });
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var items = [];
            var table = IndexedDBAdapter.database.objectStore('items');
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
        },
        /**
         * @method removeItems
         * @param {String} tableName
         * @param {Array} keys
         * @param {Function} callback
         */
        removeItems: function(tableName, keys, callback) {
            var position = 0;
            var table = IndexedDBAdapter.database.objectStore(tableName);
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
        },
        /**
         * @method setItems
         * @param {String} tableName
         * @param {Array} items
         * @param {Function} callback
         */
        setItems: function(tableName, items, callback) {
            var position = 0;
            var table = IndexedDBAdapter.database.objectStore(tableName);
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
                        skritter.log.console('tableName: ' + error);
                        console.error(tableName, items[position], error);
                    });
                } else {
                    if (typeof callback === 'function')
                        callback();
                }
            }
        }
    });

    return IndexedDBAdapter;
});