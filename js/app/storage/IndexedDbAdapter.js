/*
 * 
 * Storage: IndexedDbAdapter
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'jquery.indexeddb'
], function() {
    
    var clear = function(database, tableName, callback) {
	$.indexedDB(database.name).objectStore(tableName).each(function(item) {
	    item.delete();
	    return true;
	}).done(function() {
	    callback();
	});
    };
    
    var clearAll = function(database, callback) {
	deleteDatabase(database.name, function() {
	    openDatabase(database.name, database.version, callback);
	});
    };
    
    var deleteDatabase = function(databaseName, callback) {
	$.indexedDB(databaseName).deleteDatabase().done(function() {
	    callback();
	});
    };

    var openDatabase = function(databaseName, databaseVersion, callback) {
	$.indexedDB(databaseName, {
	    'version': databaseVersion,
	    'schema': {
		1: function(transaction) {
		    //decomps table
		    var decomps = transaction.createObjectStore('decomps', {keyPath: ['writing']});
		    decomps.createIndex('atomic', 'atomic');
		    decomps.createIndex('Children', 'Children');
		    //items table
		    var items = transaction.createObjectStore('items', {keyPath: 'id'});
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
		    //reviews table
		    var reviews = transaction.createObjectStore('reviews', {keyPath: ['itemId']});
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
		    //sentences table
		    var sentences = transaction.createObjectStore('sentences', {keyPath: ['id']});
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
	    }}).done(function(database) {
	    callback(database);
	});
    };
    
    var getItem = function(database, tableName, key, callback) {
	$.indexedDB(database.name).objectStore(tableName).get(key).then(function(event) {
	    callback(event);
	}, console.error);
    };
    
    var getItems = function(database, tableName, callback) {
	var items = [];
	$.indexedDB(database.name).objectStore(tableName).each(function(item) {
	    items.push(item.value);
	}).done(function() {
	    callback(items);
	});
    };
    
    var getItemsAt = function(database, tableName, keys, callback) {
	var items = [];
	$.indexedDB(database.name).objectStore(tableName).each(function(item) {
	    if (_.contains(keys, item.key)) {
		items.push(item);
	    }
	}).done(function() {
	    callback(items);
	});
    };

    var removeItem = function(database, tableName, key, callback) {
	$.indexedDB(database.name).objectStore(tableName, true).remove(key).then(function(event) {
	    callback(event);
	}, console.error);
    };

    var setItem = function(database, tableName, item, callback) {
	$.indexedDB(database.name).objectStore(tableName, true).put(item).then(function(event) {
	    callback(event);
	}, console.error);
    };
    
    var setItems = function(database, tableName, items, callback) {
	var position = 0;
	for (var i in items)
	{
	    var item = items[i];
	    setItem(database, tableName, item, function() {
		position++;
		if (position === items.length) {
		    callback(items.length);
		}
	    });
	}
    };
    

    return {
	clear: clear,
	clearAll: clearAll,
	deleteDatabase: deleteDatabase,
	openDatabase: openDatabase,
	getItem: getItem,
	getItems: getItems,
	getItemsAt: getItemsAt,
	removeItem: removeItem,
	setItem: setItem,
	setItems: setItems
    };
});