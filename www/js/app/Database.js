/*
 * 
 * Module: Database
 * 
 * Created By: Joshua McFarland
 * 
 */
define(function() {
    
    var Database = {
	version: 1,
	
	tables: {
	    decomps: {
		keys: ['writing'],
		fields: [
		    {name:'atomic', type:'boolean'},
		    {name:'Children', type:'object'}
		]
	    },
	    items: {
		keys: ['id'],
		fields: [
		    {name:'part', type:'string'},
		    {name:'vocabIds', type:'array'},
		    {name:'style', type:'string'},
		    {name:'timeStudied', type:'string'},
		    {name:'next', type:'number'},
		    {name:'last', type:'number'},
		    {name:'interval', type:'number'},
		    {name:'vocabListIds', type:'array'},
		    {name:'sectionIds', type:'array'},
		    {name:'reviews', type:'number'},
		    {name:'successes', type:'string'},
		    {name:'created', type:'number'},
		    {name:'changed', type:'number'},
		    {name:'previousSuccess', type:'boolean'},
		    {name:'previousInterval', type:'number'}
		]
	    },
	    reviews: {
		keys: ['itemId'],
		fields: [
		    {name:'score', type:'number'},
		    {name:'bearTime', type:'boolean'},
		    {name:'submitTime', type:'number'},
		    {name:'reviewTime', type:'number'},
		    {name:'thinkingTime', type:'number'},
		    {name:'currentInterval', type:'number'},
		    {name:'actualInterval', type:'number'},
		    {name:'newInterval', type:'number'},
		    {name:'wordGroup', type:'string'},
		    {name:'previousInterval', type:'number'},
		    {name:'previousSuccess', type:'boolean'}
		]
	    },
	    sentences: {
		keys: ['id'],
		fields: [
		    {name:'containedVocabIds', type:'array'},
		    {name:'definitions', type:'object'},
		    {name:'lang', type:'string'},
		    {name:'reading', type:'string'},
		    {name:'starred', type:'boolean'},
		    {name:'style', type:'string'},
		    {name:'toughness', type:'number'},
		    {name:'toughnessString', type:'string'},
		    {name:'writing', type:'string'}
		]
	    },
	    srsconfigs: {
		keys: ['part', 'lang'],
		fields: [
		    {name:'initialRightInterval', type:'number'},
		    {name:'initialWrongInterval', type:'number'},
		    {name:'rightFactors', type:'array'},
		    {name:'wrongFactors', type:'array'}
		]
	    },
	    strokes: {
		keys: ['rune'],
		fields: [
		    {name:'lang', type:'string'},
		    {name:'strokes', type:'array'}
		]
	    },
	    vocabs: {
		keys: ['id'],
		fields: [
		    {name:'writing', type:'string'},
		    {name:'reading', type:'string'},
		    {name:'definitions', type:'object'},
		    {name:'customDefinitions', type:'string'},
		    {name:'lang', type:'string'},
		    {name:'audio', type:'string'},
		    {name:'rareKanji', type:'boolean'},
		    {name:'toughness', type:'number'},
		    {name:'toughnessString', type:'string'},
		    {name:'mnemonic', type:'string'},
		    {name:'starred', type:'boolean'},
		    {name:'style', type:'string'},
		    {name:'changed', type:'number'},
		    {name:'bannedParts', type:'array'},
		    {name:'containedVocabIds', type:'array'},
		    {name:'heisigDefinition', type:'string'},
		    {name:'sentenceId', type:'string'},
		    {name:'topMnemonic', type:'object'}
		]
	    }
	}
    };
    
    
    return Database;
});