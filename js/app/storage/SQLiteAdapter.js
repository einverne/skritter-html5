/*
 * 
 * Module: SQLiteAdapter
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'lodash'
], function() {
    
    var tables = [
	'decomps',
	'items',
	'reviews',
	'sentences',
	'srsconfigs',
	'strokes',
	'vocabs'
    ];
    
    var openDatabase = function(databaseName, databaseVersion, callback) {
	var database = window.openDatabase(databaseName, databaseVersion, databaseName, 52428800);
	database.transaction(populateDB, errorCB, successCB);
	
	function populateDB(tx) {
	    /*tx.executeSql('DROP TABLE IF EXISTS items');
	    tx.executeSql('DROP TABLE IF EXISTS vocabs');
	    tx.executeSql('DROP TABLE IF EXISTS strokes');
	    tx.executeSql('DROP TABLE IF EXISTS srsconfigs');
	    tx.executeSql('DROP TABLE IF EXISTS decomps');
	    tx.executeSql('DROP TABLE IF EXISTS sentences');
	    tx.executeSql('DROP TABLE IF EXISTS reviews');*/
	    tx.executeSql('CREATE TABLE IF NOT EXISTS items (id PRIMARY KEY, part, vocabIds, style, timeStudied, next, last, interval, vocabListIds, sectionIds, reviews, successes, created, changed, previousSuccess, previousInterval)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS vocabs (id PRIMARY KEY, writing, reading, definitions, customDefinitions, lang, audio, rareKanji, toughness, toughnessString, mnemonic, starred, style, changed, bannedParts, containedVocabIds, heisigDefinition, sentenceId, topMnemonic)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS strokes (rune PRIMARY KEY, lang, strokes)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS srsconfigs (part, lang, initialRightInterval, initialWrongInterval, rightFactors, wrongFactors, PRIMARY KEY (part, lang))');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS decomps (writing PRIMARY KEY, atomic, Children)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS sentences (id PRIMARY KEY, containedVocabIds, definitions, lang, reading, starred, style, toughness, toughnessString, writing)');
	    tx.executeSql('CREATE TABLE IF NOT EXISTS reviews (itemId PRIMARY KEY, score, bearTime, submitTime, reviewTime, thinkingTime, currentInterval, actualInterval, newInterval, wordGroup, previousInterval, previousSuccess)');
	}

	function errorCB(error) {
	    alert("SQL Error: " + error.code);
	}

	function successCB() {
	    callback(database);
	}
	
	
    };
    
    var clear = function(database, tableName, callback) {
	database.transaction(query, error);
	
	function error(error) {
	    console.error(error);
	}
	
	var max = 0;
	var counter = 0;
	function query(tx) {
	    
	    if (tableName) {
		max = 1;
		tx.executeSql("DELETE FROM " + tableName, [], querySuccess, queryError);
		return;
	    }
	    
	    max = tables.length;
	    for (var i in tables)
	    {
		tx.executeSql("DELETE FROM " + tables[i], [], querySuccess, queryError);
	    }
	}
	
	function querySuccess(tx, results) {
	    counter++;
	    console.log(counter + '/' + max);
	    if (counter >= max) {
		callback(results);
	    }
	}
	function queryError(error) {
	    callback(error);
	}
    };
    
    var getItems = function(database, tableName, callback) {
	database.transaction(query, error);
	
	function error(error) {
	    console.error(error);
	}
	
	function query(tx) {
	    tx.executeSql("SELECT * FROM " + tableName, [], querySuccess, queryError);
	}
	
	function querySuccess(tx, result) {
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
		    item['rightFactors'] = item['rightFactors'].split(',');
		    item['wrongFactors'] = item['wrongFactors'].split(',');
		}
		//STROKES
		if (tableName === 'strokes') {
		    item['strokes'] = JSON.parse(item['strokes']);
		}
		//VOCABS
		if (tableName === 'vocabs') {
		    item['containedVocabIds'] = item['containedVocabIds'].split(',');
		    item['definitions'] = JSON.parse(item['definitions']);
		    if (item['topMnemonic'] !== 'undefined') {
			item['topMnemonic'] = JSON.parse(item['topMnemonic']);
		    } else {
			delete item['topMnemonic'];
		    }
		}
		
		results.push(item);
	    }
	    callback(results);
	}
	
	function queryError(error) {
	    console.error(error);
	}
    };
    
    var setItem = function(database, tableName, item, callback) {
	database.transaction(query, error);
	
	function error(error) {
	    console.error(error);
	}
	
	function query(tx) {
		//DECOMPS
		if (tableName === 'decomps') {
		    tx.executeSql("INSERT OR REPLACE INTO decomps (writing,atomic,Children) VALUES (?,?,?)",[
			item.writing,
			item.atomic,
			JSON.stringify(item.Children)
		    ], querySuccess, queryError);
		}
		//ITEMS
		if (tableName === 'items') {
		    tx.executeSql("INSERT OR REPLACE INTO items (id,part,vocabIds,style,timeStudied,next,last,interval,vocabListIds,sectionIds,reviews,successes,created,changed,previousSuccess,previousInterval) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
			item.id,
			item.part,
			JSON.stringify(item.vocabIds),
			item.style,
			item.timeStudied,
			item.next,
			item.last,
			item.interval,
			JSON.stringify(item.vocabListIds),
			JSON.stringify(item.sectionIds),
			item.reviews,
			item.successes,
			item.created,
			item.changed,
			item.previousSuccess,
			item.previousInterval
		    ], querySuccess, queryError);
		}
		//REVIEWS
		if (tableName === 'reviews') {
		    tx.executeSql("INSERT OR REPLACE INTO reviews (itemId,score,bearTime,submitTime,reviewTime,thinkingTime,currentInterval,actualInterval,newInterval,wordGroup,previousInterval,previousSuccess) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[
			item.itemId,
			item.score,
			item.bearTime,
			item.submitTime,
			item.reviewTime,
			item.thinkingTime,
			item.currentInterval,
			item.actualInterval,
			item.newInterval,
			item.wordGroup,
			item.previousInterval,
			item.previousSuccess
		    ], querySuccess, queryError);
		}
		//SRSCONFIGS
		if (tableName === 'srsconfigs') {
		    tx.executeSql("INSERT OR REPLACE INTO srsconfigs (part,lang,initialRightInterval,initialWrongInterval,rightFactors,wrongFactors) VALUES (?,?,?,?,?,?)",[
			item.part,
			item.lang,
			item.initialRightInterval,
			item.initialWrongInterval,
			item.rightFactors,
			item.wrongFactors
		    ], querySuccess, queryError);
		}
		//SENTENCES
		if (tableName === 'sentences') {
		    tx.executeSql("INSERT OR REPLACE INTO sentences (id,containedVocabIds,definitions,lang,reading,starred,style,toughness,toughnessString,writing) VALUES (?,?,?,?,?,?,?,?,?,?)",[
			item.id,
			item.containedVocabIds,
			JSON.stringify(item.definitions),
			item.lang,
			item.reading,
			item.starred,
			item.style,
			item.toughness,
			item.toughnessString,
			item.writing
		    ], querySuccess, queryError);
		}
		//STROKES
		if (tableName === 'strokes') {
		    tx.executeSql("INSERT OR REPLACE INTO strokes (rune, lang, strokes) VALUES (?,?,?)",[
			item.rune,
			item.lang,
			JSON.stringify(item.strokes)
		    ], querySuccess, queryError);
		}
		//VOCABS
		if (tableName === 'vocabs') {
		    tx.executeSql("INSERT OR REPLACE INTO vocabs (id,writing,reading,definitions,customDefinitions,lang,audio,rareKanji,toughness,toughnessString,mnemonic,starred,style,changed,bannedParts,containedVocabIds,heisigDefinition,sentenceId,topMnemonic) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
			item.id,
			item.writing,
			item.reading,
			JSON.stringify(item.definitions),
			JSON.stringify(item.customDefinitions),
			item.lang,
			item.audio,
			item.rareKanji,
			item.toughness,
			item.toughnessString,
			item.mnemonic,
			item.starred,
			item.style,
			item.changed,
			item.bannedParts,
			item.containedVocabIds,
			item.heisigDefinition,
			item.sentenceId,
			JSON.stringify(item.topMnemonic)
		    ], querySuccess, queryError);
		}
	    
	}

	function querySuccess(tx, results) {
	    callback(results);
	}
	function queryError(error) {
	    counter++;
	    console.error(error);
	    callback(error);
	}
    };
    
    var setItems = function(database, tableName, items, callback) {
	database.transaction(query, error);
	
	function error(error) {
	    console.error(error);
	}
	
	function query(tx) {
	    for (var i in items)
	    {
		var item = items[i];
		//DECOMPS
		if (tableName === 'decomps') {
		    tx.executeSql("INSERT OR REPLACE INTO decomps (writing,atomic,Children) VALUES (?,?,?)",[
			item.writing,
			item.atomic,
			JSON.stringify(item.Children)
		    ], querySuccess, queryError);
		}
		//ITEMS
		if (tableName === 'items') {
		    tx.executeSql("INSERT OR REPLACE INTO items (id,part,vocabIds,style,timeStudied,next,last,interval,vocabListIds,sectionIds,reviews,successes,created,changed,previousSuccess,previousInterval) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
			item.id,
			item.part,
			JSON.stringify(item.vocabIds),
			item.style,
			item.timeStudied,
			item.next,
			item.last,
			item.interval,
			JSON.stringify(item.vocabListIds),
			JSON.stringify(item.sectionIds),
			item.reviews,
			item.successes,
			item.created,
			item.changed,
			item.previousSuccess,
			item.previousInterval
		    ], querySuccess, queryError);
		}
		//REVIEWS
		if (tableName === 'reviews') {
		    tx.executeSql("INSERT OR REPLACE INTO reviews (itemId,score,bearTime,submitTime,reviewTime,thinkingTime,currentInterval,actualInterval,newInterval,wordGroup,previousInterval,previousSuccess) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[
			item.itemId,
			item.score,
			item.bearTime,
			item.submitTime,
			item.reviewTime,
			item.thinkingTime,
			item.currentInterval,
			item.actualInterval,
			item.newInterval,
			item.wordGroup,
			item.previousInterval,
			item.previousSuccess
		    ], querySuccess, queryError);
		}
		//SRSCONFIGS
		if (tableName === 'srsconfigs') {
		    tx.executeSql("INSERT OR REPLACE INTO srsconfigs (part,lang,initialRightInterval,initialWrongInterval,rightFactors,wrongFactors) VALUES (?,?,?,?,?,?)",[
			item.part,
			item.lang,
			item.initialRightInterval,
			item.initialWrongInterval,
			item.rightFactors,
			item.wrongFactors
		    ], querySuccess, queryError);
		}
		//SENTENCES
		if (tableName === 'sentences') {
		    tx.executeSql("INSERT OR REPLACE INTO sentences (id,containedVocabIds,definitions,lang,reading,starred,style,toughness,toughnessString,writing) VALUES (?,?,?,?,?,?,?,?,?,?)",[
			item.id,
			item.containedVocabIds,
			JSON.stringify(item.definitions),
			item.lang,
			item.reading,
			item.starred,
			item.style,
			item.toughness,
			item.toughnessString,
			item.writing
		    ], querySuccess, queryError);
		}
		//STROKES
		if (tableName === 'strokes') {
		    tx.executeSql("INSERT OR REPLACE INTO strokes (rune, lang, strokes) VALUES (?,?,?)",[
			item.rune,
			item.lang,
			JSON.stringify(item.strokes)
		    ], querySuccess, queryError);
		}
		//VOCABS
		if (tableName === 'vocabs') {
		    tx.executeSql("INSERT OR REPLACE INTO vocabs (id,writing,reading,definitions,customDefinitions,lang,audio,rareKanji,toughness,toughnessString,mnemonic,starred,style,changed,bannedParts,containedVocabIds,heisigDefinition,sentenceId,topMnemonic) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
			item.id,
			item.writing,
			item.reading,
			JSON.stringify(item.definitions),
			JSON.stringify(item.customDefinitions),
			item.lang,
			item.audio,
			item.rareKanji,
			item.toughness,
			item.toughnessString,
			item.mnemonic,
			item.starred,
			item.style,
			item.changed,
			item.bannedParts,
			item.containedVocabIds,
			item.heisigDefinition,
			item.sentenceId,
			JSON.stringify(item.topMnemonic)
		    ], querySuccess, queryError);
		}
	    }
	}
	
	var counter = 0;
	function querySuccess(tx, results) {
	    counter++;
	    if (counter >= items.length)
		callback();
	}
	function queryError(error) {
	    counter++;
	    console.error(error);
	    if (counter >= items.length)
		callback();
	}
    };
    
    return {
	clear: clear,
	openDatabase: openDatabase,
	getItems: getItems,
	setItem: setItem,
	setItems: setItems
    };
});