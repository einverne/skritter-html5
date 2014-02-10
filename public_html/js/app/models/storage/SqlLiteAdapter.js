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
         * @method count
         * @param {String} tableName
         * @param {Function} callback
         */
        count: function(tableName, callback) {
            var rowCount = 0;
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('SELECT COUNT(*) rowCount FROM ' + tableName, [], querySuccess, queryError);
                function querySuccess(t, result) {
                    rowCount = result.rows.item(0).rowCount;
                }
                function queryError(error) {
                    console.error('SQL ERROR', error);
                }
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback(rowCount);
            }
        },
        /**
         * @method deleteDatabase
         * @param {Function} callback
         */
        deleteDatabase: function(callback) {
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                for (var name in SqlLiteAdapter.tables)
                    t.executeSql('DROP TABLE IF EXISTS ' + name);
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback();
            }
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
                t.executeSql('SELECT * FROM ' + tableName + ' WHERE id IN (' + skritter.fn.getSqlValueString(keys) + ')', keys, querySuccess, queryError);
                function querySuccess(t, result) {
                    items = SqlLiteAdapter.this.parseResult(tableName, result);
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
         * @method getItemsWhere
         * @param {String} tableName
         * @param {String} attribute
         * @param {String} value
         * @param {Function} callback
         */
        getItemsWhere: function(tableName, attribute, value, callback) {
            var item = null;
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('SELECT * FROM ' + tableName + ' WHERE ' + attribute + '=?', [value], querySuccess, queryError);
                function querySuccess(t, result) {
                    item = SqlLiteAdapter.this.parseResult(result);
                    if (item.length === 1)
                        item = item[0];
                }
                function queryError(error) {
                    console.error('SQL ERROR', error);
                }
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback(item);
            }
            /*var items = [];
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
            });*/
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
                            vocabIds: item.vocabIds.split(',')
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
         * @method removeItems
         * @param {String} tableName
         * @param {Array} keys
         * @param {Function} callback
         */
        removeItems: function(tableName, keys, callback) {
            keys = Array.isArray(keys) ? keys : [keys];
            keys = _.remove(keys, undefined);
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('DELETE * FROM ' + tableName + ' WHERE id IN (' + skritter.fn.getSqlValueString(keys) + ')', keys);
            }
            function transactionError(error) {
                console.error('SQL ERROR', error);
            }
            function transactionSuccess() {
                callback();
            }
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
                queryString += tableName + ' (' + table.keys.join(',') + ',' + table.fields.join(',') + ')' + ' VALUES (' + skritter.fn.getSqlValueString(table.names.concat(table.fields)) + ')';
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