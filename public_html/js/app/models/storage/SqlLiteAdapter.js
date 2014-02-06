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
            SqlLiteAdapter.database.transaction(populate, error);
            function populate(tx) {
                var position = 0;
                createNext();
                function createNext() {
                    if (position < SqlLiteAdapter.tables.length) {
                        for (var name in SqlLiteAdapter.tables) {
                            var table = SqlLiteAdapter.tables[name];
                            var queryString = 'CREATE TABLE IF NOT EXISTS ';
                            queryString += name + ' (' + table.keys[0] + ' PRIMARY KEY,' + table.fields.join(',') + ')';
                            position++;
                            tx.executeSql(queryString, [], createNext, error);
                        }
                    } else {
                        callback();
                    }
                }
            }
            function error(error) {
                alert('ERROR: ' + JSON.stringify(error));
            }
        },
        /**
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         */
        getAll: function(tableName, callback) {
            SqlLiteAdapter.database.transaction(populate, error, success);
            function populate(tx) {
                tx.executeSql('SELECT * FROM ' + tableName, [], querySuccess, error);
                function querySuccess(tx, result) {
                    callback(SqlLiteAdapter.this.parseResult(tableName, result));
                }
            }
            function error() {
                console.error('ERROR: ' + JSON.stringify(error));
            }
            function success() {
                callback();
            }
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
         * @method parseResult
         * @param {String} tableName
         * @param {Array} result
         * @returns {Array}
         */
        parseResult: function(tableName, result) {
            var parsedResults = [];
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
                parsedResults.push(item);
            }
            alert('table: ' + tableName + ' results: ' + parsedResults.length);
            return parsedResults;
        },
        /**
         * @method setItems
         * @param {String} tableName
         * @param {Array} items
         * @param {Function} callback
         */
        setItems: function(tableName, items, callback) {
            SqlLiteAdapter.database.transaction(populate, error);
            function populate(tx) {
                var position = 0;
                var table = SqlLiteAdapter.tables[tableName];
                var queryString = 'INSERT OR REPLACE INTO ';
                queryString += tableName + ' (' + table.keys.join(',') + ', ' + table.fields.join(',') + ')' + ' VALUES (' + SqlLiteAdapter.this.getValueString(table) + ')';
                setNext();
                function setNext() {
                    if (position < items.length) {
                        var item = items[position];
                        var values = [];
                        for (var b in table.fields) {
                            var value = item[table.fields[b]];
                            if (typeof value === 'undefined') {
                                value = '';
                            } else if (value.constructor === Array || value.constructor === Object) {
                                value = JSON.stringify(value);
                            }
                            values.push(value);
                        }
                        position++;
                        tx.executeSql(queryString, values, setNext, error);
                    } else {
                        if (typeof callback === 'function')
                            callback();
                    }
                }
            }
            function error(error) {
                console.error('ERROR: ' + JSON.stringify(error));
            }
        }
    });

    return SqlLiteAdapter;
});