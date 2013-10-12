/**
 * @module Skritter
 * @submodule Storage
 * @param Storage
 * @author Joshua McFarland
 */
define([
    'storage/Storage',
    'lodash'
], function(Storage) {
    /**
     * @class SQLiteAdapter
     * @extends Storage
     * @constructor
     */
    SQLiteAdapter.prototype = new Storage();
    SQLiteAdapter.constructor = SQLiteAdapter;
    function SQLiteAdapter() {
    }

    /**
     * @method clear
     * @param {Function} callback Returns once the table or tables have been cleared
     * @param {String} tableName An options parameter to clear a specific table
     */
    SQLiteAdapter.prototype.clear = function(callback, tableName) {
        var tables = this.schemaSQLite;
        var errorCB;
        var queryCB;
        if (tableName) {
            errorCB = function(error) {
                console.error(error);
            };
            queryCB = function(tx) {
                tx.executeSql("DELETE FROM " + tableName, [], querySuccessCB, queryErrorCB);
                var querySuccessCB = function(tx, results) {
                    callback(results);
                };

                var queryErrorCB = function(error) {
                    console.error(error);
                };
            };
            this.database.transaction(queryCB, errorCB);
        } else {
            errorCB = function(error) {
                console.error(error);
            };
            queryCB = function(tx) {
                var counter = 0;
                var max = Object.keys(tables).length;
                for (var table in tables) {
                    tx.executeSql("DELETE FROM " + table, [], querySuccessCB, queryErrorCB);
                }

                var querySuccessCB = function(tx, results) {
                    counter++;
                    if (counter >= max) {
                        callback(results);
                    }
                };

                var queryErrorCB = function(error) {
                    console.error(error);
                };
            };
            this.database.transaction(queryCB, errorCB);
        }
    };

    /**
     * @method deleteDatabase
     * @param {Function} callback Returns once the open database has been successfully deleted
     */
    SQLiteAdapter.prototype.deleteDatabase = function(callback) {
        var tables = this.schemaSQLite;
        this.database.transaction(populateDB, errorCB, successCB);
        function populateDB(tx) {
            for (var table in tables) {
                tx.executeSql('DROP TABLE IF EXISTS ' + table);
            }
        }
        function errorCB(error) {
            console.error(error);
        }
        function successCB(tx, results) {
            callback(results);
        }
    };

    /**
     * @method getItem
     * @param {String} tableName The name of the table
     * @param {String} key The primary key or keys
     * @param {Function} callback Returns a single row as an object
     */
    SQLiteAdapter.prototype.getItem = function(tableName, key, callback) {

    };

    /**
     * @method getItems
     * @param {String} tableName
     * @param {Function} callback
     * @param {String} keys
     */
    SQLiteAdapter.prototype.getItems = function(tableName, callback, keys) {
        this.database.transaction(queryCB, errorCB);
        function errorCB(error) {
            console.error(error);
        }
        function queryCB(tx) {
            tx.executeSql("SELECT * FROM " + tableName, [], querySuccessCB, queryErrorCB);
        }
        function querySuccessCB(tx, result) {
            var results = [];
            for (var i = 0; i < result.rows.length; i++) {
                var item = _.cloneDeep(result.rows.item(i));
                //decomps
                if (tableName === 'decomps') {
                    item.Children = JSON.parse(item.Children);
                }
                //items
                if (tableName === 'items') {
                    item.vocabIds = JSON.parse(item.vocabIds);
                    item.vocabListIds = JSON.parse(item.vocabListIds);
                    item.sectionIds = JSON.parse(item.sectionIds);
                }
                //sentences
                if (tableName === 'sentences') {
                    item.containedVocabIds = item.containedVocabIds.split(',');
                    item.definitions = JSON.parse(item.definitions);
                }
                //srsconfigs
                if (tableName === 'srsconfigs') {
                    item.rightFactors = JSON.parse(item.rightFactors);
                    item.wrongFactors = JSON.parse(item.wrongFactors);
                }
                //strokes
                if (tableName === 'strokes') {
                    item.strokes = JSON.parse(item.strokes);
                }
                //vocabs
                if (tableName === 'vocabs') {
                    item.containedVocabIds = item.containedVocabIds.split(',');
                    item.definitions = JSON.parse(item.definitions);
                    if (item.topMnemonic === '') {
                        delete item.topMnemonic;
                    } else {
                        item.topMnemonic = JSON.parse(item.topMnemonic);
                    }
                }
                results.push(item);
            }
            callback(results);
        }
        function queryErrorCB(error) {
            console.error(error);
        }
    };

    /**
     * @method openDatabase
     * @param {String} databaseName The name of the database
     * @param {Function} callback Returns the successfully created database object
     */
    SQLiteAdapter.prototype.openDatabase = function(databaseName, callback) {
        var tables = this.schemaSQLite;
        this.database = window.openDatabase(databaseName, this.version, databaseName, 52428800);
        this.database.transaction(populateDB, errorCB, successCB);
        function populateDB(tx) {
            for (var table in tables) {
                var sql = 'CREATE TABLE IF NOT EXISTS';
                if (tables[table].keys.length === 0) {
                    sql += ' ' + table + ' (' + tables[table].fields.join(', ');
                } else if (tables[table].keys.length === 1) {
                    sql += ' ' + table + ' (' + tables[table].keys[0] + ' PRIMARY KEY, ' + tables[table].fields.join(', ') + ')';
                } else {
                    sql += ' ' + table + ' (' + tables[table].keys.join(', ') + ', ' + tables[table].fields.join(', ') + ', PRIMARY KEY (' + tables[table].keys.join(', ') + '))';
                }
                tx.executeSql(sql);
            }
        }
        function errorCB(error) {
            console.error(error);
        }
        function successCB(tx, results) {
            callback(results);
        }
    };

    /**
     * @method removeItem
     * @param {String} tableName
     * @param {String} key
     * @param {Function} callback
     */
    SQLiteAdapter.prototype.removeItem = function(tableName, key, callback) {

    };

    /**
     * @method setItem
     * @param {String} tableName
     * @param {Object} item An object to be saved or updated
     * @param {Function} callback
     */
    SQLiteAdapter.prototype.setItem = function(tableName, item, callback) {
        var tables = this.schemaSQLite;
        this.database.transaction(queryCB, errorCB);
        function errorCB(error) {
            console.error(error);
        }
        function queryCB(tx) {
            var table = tables[tableName];
            var valuesLength = table.keys.length + table.fields.length;
            var valuesString = '';
            for (var i = 1; i <= valuesLength; i++) {
                valuesString += '?';
                if (i !== valuesLength)
                    valuesString += ',';
            }
            var sql = 'INSERT OR REPLACE INTO';
            sql += ' ' + tableName + ' (' + table.keys.join(', ') + ', ' + table.fields.join(', ') + ')' + ' VALUES (' + valuesString + ')';
            var values = [];
            var fields = tables[tableName].keys.concat(tables[tableName].fields);
            for (i in fields) {
                var field = fields[i];
                var value = item[field];
                if (typeof value === 'undefined') {
                    value = '';
                } else if (value.constructor === Array || value.constructor === Object) {
                    value = JSON.stringify(value);
                }
                values.push(value);
            }
            tx.executeSql(sql, values, querySuccessCB, queryErrorCB);
            function querySuccessCB(tx, results) {
                callback(results);
            }
            function queryErrorCB(error) {
                console.error(error);
            }
        }
    };

    /**
     * @method setItems
     * @param {String} tableName
     * @param {Array} items An array of item objects
     * @param {Function} callback
     */
    SQLiteAdapter.prototype.setItems = function(tableName, items, callback) {
        var counter = 0;
        var max = items.length;
        for (var i in items) {
            var item = items[i];
            this.setItem(tableName, item, querySuccessCB);
        }
        function querySuccessCB() {
            counter++;
            if (counter >= max) {
                callback(counter);
            }
        }

    };


    return SQLiteAdapter;
});