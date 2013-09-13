/*
 * 
 * Storage: SQLiteAdapter
 * 
 * Created By: Joshua McFarland
 * 
 */
define(function() {
    
    var tables = {
	decomps: {
	    keys: ['writing'],
	    fields: ['atomic', 'Children']
	},
	items: {
	    keys: ['id'],
	    fields: ['part', 'vocabIds', 'style', 'timeStudied', 'next', 'last', 'interval', 'vocabListIds', 'sectionIds', 'reviews', 'successes', 'created', 'changed', 'previousSuccess', 'previousInterval']
	},
	reviews: {
	    keys: ['itemId'],
	    fields: ['score', 'bearTime', 'submitTime', 'reviewTime', 'thinkingTime', 'currentInterval', 'actualInterval', 'newInterval', 'wordGroup', 'previousInterval', 'previousSuccess']
	},
	sentences: {
	    keys: ['id'],
	    fields: ['containedVocabIds', 'definitions', 'lang', 'reading', 'starred', 'style', 'toughness', 'toughnessString', 'writing']
	},
	srsconfigs: {
	    keys: ['part', 'lang'],
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
    
    var clear = function(database, callback) {
	
    };
    
    var clearAll = function(database, callback) {
	database.transaction(queryCB, errorCB);
	
	function errorCB(error) {
	    console.error(error);
	}
	
	function queryCB(tx) {
	    var counter = 0;
	    var max = Object.keys(tables).length;
	    for (var table in tables)
	    {
		tx.executeSql("DELETE FROM " + table, [], querySuccessCB, queryErrorCB);
	    }
	    
	    function querySuccessCB(tx, results) {
		counter++;
		if (counter >= max) {
		    callback(results);
		}
	    }
	    function queryErrorCB(error) {
		console.error(error);
	    }
	}
    };
    
    var deleteDatabase = function(databaseName, callback) {
	//todo: add delete ability
    };
    
    var openDatabase = function(databaseName, databaseVersion, callback) {
	console.log(databaseName, databaseVersion);
	var database = window.openDatabase(databaseName, databaseVersion, databaseName, 52428800);
	database.transaction(populateDB, errorCB, successCB);
	
	function populateDB(tx) {
	    console.log('populating database');
	    for (var table in tables)
	    {
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

	function successCB() {
	    console.log('database loaded');
	    callback(database);
	}
    };
    
    var getItem = function(database, tableName, key, callback) {
	
    };
    
    var getItems = function(database, tableName, callback) {
	console.log('table:', tableName);
	database.transaction(queryCB, errorCB);
	
	function errorCB(error) {
	    console.error(error);
	}
	
	function queryCB(tx) {
	    tx.executeSql("SELECT * FROM " + tableName, [], querySuccessCB, queryErrorCB);
	}
	
	function querySuccessCB(tx, result) {
	    var results = [];
	    
	    for (var i=0; i < result.rows.length; i++)
	    {
		var item = _.cloneDeep(result.rows.item(i));
		
		//DECOMPS
		if (tableName === 'decomps') {
		    item['Children'] = JSON.parse(item['Children']);
		}
		//ITEMS
		if (tableName === 'items') {
		    item['vocabIds'] = JSON.parse(item['vocabIds']);
		    item['vocabListIds'] = JSON.parse(item['vocabListIds']);
		    item['sectionIds'] = JSON.parse(item['sectionIds']);
		}
		//SENTENCES
		if (tableName === 'sentences') {
		    item['containedVocabIds'] = item['containedVocabIds'].split(',');
		    item['definitions'] = JSON.parse(item['definitions']);
		}
		//SRSCONFIGS
		if (tableName === 'srsconfigs') {
		    item['rightFactors'] = JSON.parse(item['rightFactors']);
		    item['wrongFactors'] = JSON.parse(item['wrongFactors']);
		}
		//STROKES
		if (tableName === 'strokes') {
		    item['strokes'] = JSON.parse(item['strokes']);
		}
		//VOCABS
		if (tableName === 'vocabs') {
		    item['containedVocabIds'] = item['containedVocabIds'].split(',');
		    item['definitions'] = JSON.parse(item['definitions']);
		    if (item['topMnemonic'] === '') {
			delete item['topMnemonic'];
		    } else {
			item['topMnemonic'] = JSON.parse(item['topMnemonic']);
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
    
    var setItem = function(database, tableName, item, callback) {
	database.transaction(queryCB, errorCB);
	
	function errorCB(error) {
	    console.error(error);
	}
	
	function queryCB(tx) {
	    var table = tables[tableName];

	    var valuesLength = table.keys.length + table.fields.length;
	    var valuesString = '';
	    for (var i = 1; i <= valuesLength; i++)
	    {
		valuesString += '?';
		if (i !== valuesLength)
		    valuesString += ',';
	    }

	    var sql = 'INSERT OR REPLACE INTO';
	    sql += ' ' + tableName + ' (' + table.keys.join(', ') + ', ' + table.fields.join(', ') + ')' + ' VALUES (' + valuesString + ')';

	    var values = [];
	    var fields = tables[tableName].keys.concat(tables[tableName].fields);
	    for (var i in fields)
	    {
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
    
    var setItems = function(database, tableName, items, callback) {
	database.transaction(queryCB, errorCB);
	
	function errorCB(error) {
	    console.error(error);
	}
	
	function queryCB(tx) {
	    var counter = 0;
	    var max = items.length;
	    for (var i in items)
	    {
		var item = items[i];
		setItem(database, tableName, item, querySuccessCB);
	    }
	    
	    function querySuccessCB(tx, results) {
		counter++;
		if (counter >= max) {
		    callback(counter);
		}
	    }
	}
    };
    
    
    return {
	clear: clear,
	clearAll: clearAll,
	deleteDatabase: deleteDatabase,
	getItem: getItem,
	getItems: getItems,
	openDatabase: openDatabase,
	setItem: setItem,
	setItems: setItems
    };
});