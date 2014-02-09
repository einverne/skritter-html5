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
                    fields: ['lang', 'part', 'vocabIds', 'style', 'timeStudied', 'next', 'last', 'interval', 'vocabListIds', 'sectionIds', 'reviews', 'successes', 'created', 'changed', 'previousSuccess', 'previousInterval']
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
         * @method getAll
         * @param {String} tableName
         * @param {Function} callback
         */
        getAll: function(tableName, callback) {           
            var scheduledItems = [];
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('SELECT * FROM ' + tableName, [], querySuccess, queryError);
                function querySuccess(t, result) {
                    scheduledItems = SqlLiteAdapter.this.parseResult(tableName, result);
                }
                function queryError(error) {
                    console.error('SQL ERROR', error);
                }
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback(scheduledItems);
            }
        },
        /**
         * @method getItems
         * @param {String} tableName
         * @param {Arrau} keys
         * @param {Function} callback
         */
        getItems: function(tableName, keys, callback) {
            var items = [];
            keys = Array.isArray(keys) ? keys : [keys];
            keys = _.remove(keys, undefined);
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                var valueString = '';
                for (var i = 1; i <= keys.length; i++) {
                    valueString += '?';
                    if (i !== keys.length)
                        valueString += ',';
                }
                t.executeSql('SELECT * FROM ' + tableName + ' WHERE id IN (' + valueString + ')', keys, querySuccess, queryError);
                function querySuccess(t, result) {
                    for (var i = 0; i < result.rows.length; i++)
                        items.push(result.rows.item(i));
                }
                function queryError(error) {
                    console.error('SQL ERROR', error);
                }
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback(items);
            }
        },
        /**
         * @method getSchedule
         * @param {Function} callback
         */
        getSchedule: function(callback) {
            var scheduleItems = [];
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('SELECT id,last,next,part,style,vocabIds FROM items', [], querySuccess, queryError);
                function querySuccess(t, result) {
                    for (var i = 0; i < result.rows.length; i++) {
                        var item = _.cloneDeep(result.rows.item(i));
                        var splitId = item.id.split('-');
                        scheduleItems.push({
                            base: splitId[1] + '-' + splitId[2] + '-' + splitId[3],
                            id: item.id,
                            last: (item.last) ? item.last : 0,
                            next: item.next,
                            part: item.part,
                            style: item.style,
                            vocabIds: JSON.parse(item.vocabIds)
                        });
                    }
                }
                function queryError(error) {
                    console.error('SQL ERROR', error);
                }
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback(scheduleItems);
            }
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
         * @method openDatabase
         * @param {String} databaseName
         * @param {Function} callback
         */
        openDatabase: function(databaseName, callback) {
            SqlLiteAdapter.database = window.sqlitePlugin.openDatabase({name: databaseName});
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                for (var name in SqlLiteAdapter.tables) {
                    var table = SqlLiteAdapter.tables[name];
                    var queryString = 'CREATE TABLE IF NOT EXISTS ';
                    queryString += name + ' (' + table.keys[0] + ' PRIMARY KEY,' + table.fields.join(',') + ')';
                    t.executeSql(queryString, []);
                }
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback();
            }
        },
        /**
         * @method parseResult
         * @param {String} tableName
         * @param {Object} result
         * @returns {Array}
         */
        parseResult: function(tableName, result) {
            var parsedResult = [];
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
                parsedResult.push(item);
            }
            return parsedResult;
        },
        /**
         * @method setItems
         * @param {String} tableName
         * @param {Array} items
         * @param {Function} callback
         */
        setItems: function(tableName, items, callback) {
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                var table = SqlLiteAdapter.tables[tableName];
                var queryString = 'INSERT OR REPLACE INTO ';
                queryString += tableName + ' (' + table.keys.join(',') + ',' + table.fields.join(',') + ')' + ' VALUES (' + SqlLiteAdapter.this.getValueString(table) + ')';
                var fields = SqlLiteAdapter.tables[tableName].keys.concat(SqlLiteAdapter.tables[tableName].fields);
                for (var a in items) {
                    var item = items[a];
                    var values = [];
                    for (var b in fields) {
                        var value = item[fields[b]];
                        if (typeof value === 'undefined') {
                            value = '';
                        } else if (value.constructor === Array || value.constructor === Object) {
                            value = JSON.stringify(value);
                        }
                        values.push(value);
                    }
                    t.executeSql(queryString, values, querySuccess, queryError);
                }
                function querySuccess() {
                }
                function queryError(error) {
                    console.error('SQL ERROR', error);
                }
            }

            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback();
            }
        }
    });

    return SqlLiteAdapter;
});