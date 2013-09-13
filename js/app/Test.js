/*
 * 
 * Module: Test
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Database'
], function(DB) {
    
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
    
    var check = function() {
	console.log(DB.tables['items'].fields);
	var fields = DB.tables['items'].fields;
	for (var i in fields) {
	    var field = fields[i];
	    console.log(field.name);
	}
	return;
    };
    
    return {
	check: check
    };
});