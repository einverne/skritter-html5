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
                },
                vocablists: {
                    keys: ['id'],
                    fields: ['name', 'lang', 'shortName', 'description', 'categories', 'creator', 'changed', 'published', 'deleted', 'parent', 'sort', 'singleSect', 'tags', 'editors', 'public', 'peopleStudying', 'studyingMode', 'currentSection', 'currentIndex', 'sectionsSkipping', 'autoSectionMovement', 'sections']
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
            var items = [];
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('SELECT * FROM ' + tableName, [], querySuccess, queryError);
                function querySuccess(t, result) {
                    items = SqlLiteAdapter.this.parseResult(result);
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
         * @method getItems
         * @param {String} tableName
         * @param {Arrau} keys
         * @param {Function} callback
         */
        getItems: function(tableName, keys, callback) {
            var items = [];
            keys = Array.isArray(keys) ? keys : [keys];
            for (var i in keys)
                    keys[i] = JSON.stringify(keys[i]);
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                t.executeSql('SELECT * FROM ' + tableName + ' WHERE id IN (' + skritter.fn.getSqlValueString(keys) + ')', keys, querySuccess, queryError);
                function querySuccess(t, result) {
                    items = SqlLiteAdapter.this.parseResult(result);
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
                t.executeSql('SELECT * FROM ' + tableName + ' WHERE ' + attribute + '=?', [JSON.stringify(value)], querySuccess, queryError);
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
                    var items = SqlLiteAdapter.this.parseResult(result);
                    for (var i in items) {
                        var item = items[i];
                        var splitId = item.id.split('-');
                        scheduleItems.push({
                            base: splitId[1] + '-' + splitId[2] + '-' + splitId[3],
                            id: item.id,
                            last: (item.last) ? item.last : 0,
                            next: item.next,
                            part: item.part,
                            style: item.style,
                            vocabIds: item.vocabIds
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
         * @param {Object} result
         * @returns {Array}
         */
        parseResult: function(result) {
            var parsedResult = [];
            for (var i = 0; i < result.rows.length; i++) {
                var item = _.cloneDeep(result.rows.item(i));
                for (var key in item)
                    if (item.hasOwnProperty(key))
                        item[key] = JSON.parse(item[key]);
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
            items = Array.isArray(items) ? items : [items];
            SqlLiteAdapter.database.transaction(transaction, transactionError, transactionSuccess);
            function transaction(t) {
                var table = SqlLiteAdapter.tables[tableName];
                var queryString = 'INSERT OR REPLACE INTO ';
                queryString += tableName + ' (' + table.keys.join(',') + ',' + table.fields.join(',') + ')' + ' VALUES (' + skritter.fn.getSqlValueString(table.keys.concat(table.fields)) + ')';
                var fields = table.keys.concat(table.fields);
                for (var a in items) {
                    var item = items[a];
                    var values = [];
                    for (var b in fields) {
                        var value = item[fields[b]];
                        if (typeof value === 'undefined') {
                            values.push('null');
                        } else {
                            values.push(JSON.stringify(value));
                        }
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