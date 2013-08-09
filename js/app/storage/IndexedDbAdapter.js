/*
 * 
 * Module: IndexedDbAdapter
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'lodash'
], function() {
    
    var openDatabase = function(databaseName, databaseVersion, callback) {
	var request = window.indexedDB.open(databaseName, databaseVersion);
	
	request.onerror = function(error) {
	    console.error(error);
	    callback(error);
	};
	
	request.onsuccess = function(event) {
	    callback(event.target.result);
	};
	
	request.onupgradeneeded = function(event) {
	    var database = event.target.result;
	    //items table
	    var items = database.createObjectStore('items', {keyPath: 'id'});
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
	    //vocabs table
	    var vocabs = database.createObjectStore('vocabs', {keyPath: 'id'});
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
	    //data table
	    var strokes = database.createObjectStore('strokes', {keyPath: 'rune'});
	    strokes.createIndex('lang', 'lang');
	    strokes.createIndex('strokes', 'strokes');
	    //srsconfigs table
	    var srsconfigs = database.createObjectStore('srsconfigs', {keyPath: ['part', 'lang']});
	    srsconfigs.createIndex('initialRightInterval', 'initialRightInterval');
	    srsconfigs.createIndex('initialWrongInterval', 'initialWrongInterval');
	    srsconfigs.createIndex('rightFactors', 'rightFactors');
	    srsconfigs.createIndex('wrongFactors', 'wrongFactors');
	    //decomps table
	    var decomps = database.createObjectStore('decomps', {keyPath: ['writing']});
	    decomps.createIndex('atomic', 'atomic');
	    decomps.createIndex('Children', 'Children');
	    //sentences table
	    var sentences = database.createObjectStore('sentences', {keyPath: ['id']});
	    sentences.createIndex('containedVocabIds', 'containedVocabIds');
	    sentences.createIndex('definitions', 'definitions');
	    sentences.createIndex('lang', 'lang');
	    sentences.createIndex('reading', 'reading');
	    sentences.createIndex('starred', 'starred');
	    sentences.createIndex('style', 'style');
	    sentences.createIndex('toughness', 'toughness');
	    sentences.createIndex('toughnessString', 'toughnessString');
	    sentences.createIndex('writing', 'writing');
	    //reviews table
	    var reviews = database.createObjectStore('reviews', {keyPath: ['itemId']});
	    reviews.createIndex('score', 'score');
	    reviews.createIndex('bearTime', 'bearTime');
	    reviews.createIndex('submitTime', 'submitTime');
	    reviews.createIndex('reviewTime', 'reviewTime');
	    reviews.createIndex('thinkingTime', 'thinkingTime');
	    reviews.createIndex('currentInterval', 'currentInterval');
	    reviews.createIndex('actualInterval', 'actualInterval');
	    reviews.createIndex('newInterval', 'newInterval');
	    reviews.createIndex('wordGroup', 'wordGroup');
	    reviews.createIndex('previousInterval', 'previousInterval');
	    reviews.createIndex('previousSuccess', 'previousSuccess');
	};
    };
    
    var deleteDatabase = function(database, callback) {
	var request = window.indexedDB.deleteDatabase(database);
	request.onerror = function(error) {
	    console.error(error);
	    callback(error);
	};
	request.onsuccess = function(event) {
	    callback(event);
	};
    };
    
    var clear = function(database, tableName, callback) {
	if (tableName) {
	    var table = database.transaction([tableName]).objectStore(tableName);
	    var request = table.clear();
	    request.onerror = function(event) {
		console.error(event);
		if (typeof callback === 'function')
		    callback(event);
	    };
	    request.onsuccess = function(event) {
		if (typeof callback === 'function')
		    callback(event);
	    };
	    
	    return;
	}
	
	var position = 0;
	var tableNames = database.objectStoreNames;
	for (var i=0; i < tableNames.length; i++)
	{
	    var table = database.transaction([tableNames[i]], 'readwrite').objectStore(tableNames[i]);
	    var request = table.clear();
	    request.onerror = function(event) {
		console.error(event);
		if (typeof callback === 'function')
		    callback(event);
	    };
	    request.onsuccess = function() {
		position++;
		if (position === tableNames.length) {
		    if (typeof callback === 'function')
			callback();
		}
	    };
	}
    };
    
    var getItem = function(database, tableName, key, callback) {
	var table = database.transaction([tableName]).objectStore(tableName);
	var request = table.get(key);
	request.onerror = function(event) {
	    console.error(event);
	    if (typeof callback === 'function')
		callback(event);
	};
	request.onsuccess = function() {
	    if (typeof callback === 'function')
		callback(request.result);
	};
    };
    
    var getItems = function(database, tableName, callback) {
	var items = [];
	var cursor = database.transaction([tableName]).objectStore(tableName).openCursor();
	cursor.onerror = function(event) {
	    console.error(event);
	    if (typeof callback === 'function')
		callback(event);
	};
	cursor.onsuccess = function(event) {
	    var cursor = event.target.result;
	    if (cursor) {
		items.push(cursor.value);
		cursor.continue();
	    } else {
		if (typeof callback === 'function')
		    callback(items);
	    }
	};
    };
    
    var setItem = function(database, tableName, item, callback) {
	var transaction = database.transaction([tableName], 'readwrite');
	var table = transaction.objectStore(tableName);
	var request = table.put(item);
	request.onerror = function(event) {
	    console.error(event);
	    if (typeof callback === 'function')
		callback(event);
	};
	request.onsuccess = function(event) {
	    if (typeof callback === 'function')
		callback(event);
	};
    };
    
    var setItems = function(database, tableName, items, callback) {
	var transaction = database.transaction([tableName], 'readwrite');
	var table = transaction.objectStore(tableName);
	var completedTotal = 0;
	for (var i in items) {
	    var request = table.put(items[i]);
	    request.onerror = function(event) {
		console.error(event);
		if (typeof callback === 'function')
		    callback(event);
	    };
	    request.onsuccess = function() {
		completedTotal++;
		if (completedTotal === items.length-1) {
		    if (typeof callback === 'function') {
			callback(items.length);
		    }
		}
	    };
	}
    };

    
    return {
	openDatabase: openDatabase,
	deleteDatabase: deleteDatabase,
	clear: clear,
	getItem: getItem,
	getItems: getItems,
	setItem: setItem,
	setItems: setItems
    };
    
});