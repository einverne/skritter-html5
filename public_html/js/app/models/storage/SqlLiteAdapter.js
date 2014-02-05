/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class SqlLiteAdapter
     */
    var SqlLiteAdapter = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            SqlLiteAdapter.this = this;
            SqlLiteAdapter.database = null;
            SqlLiteAdapter.tables = {
                decomps: {
                    keys: ['writing'],
                    fields: ['atomic', 'Children']
                },
                items: {
                    keys: ['id'],
                    fields: ['part', 'vocabIds', 'style', 'timeStudied', 'next', 'last', 'interval', 'vocabListIds', 'sectionIds', 'reviews', 'successes', 'created', 'changed', 'previousSuccess', 'previousInterval']
                },
                reviews: {
                    keys: ['id'],
                    fields: ['score', 'bearTime', 'reviewTime', 'thinkingTime', 'currentInterval', 'actualInterval', 'newInterval', 'wordGroup', 'previousInterval', 'previousSuccess']
                },
                sentences: {
                    keys: ['id'],
                    fields: ['containedVocabIds', 'definitions', 'lang', 'reading', 'starred', 'style', 'toughness', 'toughnessString', 'writing']
                },
                srsconfigs: {
                    keys: ['part'],
                    fields: ['initialRightInterval', 'initialWrongInterval', 'rightFactors', 'wrongFactors']
                },
                strokes: {
                    keys: ['rune'],
                    fields: ['lang', 'strokes']
                },
                vocabs: {
                    keys: ['id'],
                    fields: ['writing', 'reading', 'definitions', 'customDefinitions', 'lang', 'audio', 'rareKanji', 'toughness', 'toughnessString', 'mnemonic', 'starred', 'style', 'changed', 'bannedParts', 'containedVocabIds', 'heisigDefinition', 'sentenceId', 'topMnemonic']
                }
            };
        },
        /**
         * @method openDatabase
         * @param {String} databaseName
         * @param {Function} callback
         */
        openDatabase: function(databaseName, callback) {
            SqlLiteAdapter.database = window.sqlitePlugin.openDatabase(databaseName, '1.0', databaseName, -1);
            SqlLiteAdapter.database.transaction(populate, error, success);
            function populate(tx) {
                for (var name in SqlLiteAdapter.tables) {
                    var table = SqlLiteAdapter.tables[name];
                    var queryString = 'CREATE TABLE IF NOT EXISTS ';
                    queryString += name + ' (' + table.keys[0] + ' PRIMARY KEY,' + table.fields.join(',') + ')';
                    tx.executeSql(queryString);
                }
            }
            function error(error) {
                alert('ERROR: ' + JSON.stringify(error));
            }
            function success() {
                callback();
            }
        },
        /**
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         */
        getAll: function(tableName, callback) {
            callback();
        },
        /**
         * @method getItems
         * @param {String} tableName
         * @param {Arrau} keys
         * @param {Function} callback
         */
        getItems: function(tableName, keys, callback) {
            callback();
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            callback();
        },
        /**
         * @method getValueString
         * @param {Object} table
         * @returns {String}
         */
        getValueString: function(table) {
            var stringLength = table.keys.length + table.fields.length;
            var stringValue = '';
            for (var i = 1; i <= stringLength; i++) {
                stringValue += '?';
                if (i !== stringLength)
                    stringValue += ',';
            }
            return stringValue;
        },
        /**
         * @method setItems
         * @param {String} tableName
         * @param {Array} items
         * @param {Function} callback
         */
        setItems: function(tableName, items, callback) {
            SqlLiteAdapter.database.transaction(populate, error, success);
            function populate(tx) {
                var table = SqlLiteAdapter.tables[tableName];
                var queryString = 'INSERT OR REPLACE INTO ';
                queryString += tableName + ' (' + table.keys.join(',') + ', ' + table.fields.join(',') + ')' + ' VALUES (' + SqlLiteAdapter.this.getValueString(table) + ')';
                for (var i in items) {
                    var item = items[i];
                    var values = [];
                    for (var field in table.fields) {
                        var fieldValue = item[field];
                        if (typeof fieldValue === 'undefined') {
                            fieldValue = '';
                        } else if (fieldValue.constructor === Array || fieldValue.constructor === Object) {
                            fieldValue = JSON.stringify(fieldValue);
                        }
                        values.push(fieldValue);
                    }
                    tx.executeSql(queryString, values, null, error);
                }
            }
            function error(error) {
                alert('ERROR: ' + JSON.stringify(error));
            }
            function success() {
                callback();
            }
        }
    });

    return SqlLiteAdapter;
});