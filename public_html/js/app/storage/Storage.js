/**
 * @module Skritter
 * @submodule Storage
 * @author Joshua McFarland
 */
define(function() {
    /**
     * This is a parent class used to store generic information about the database structure.
     * 
     * @class Storage
     * @constructor
     */
    function Storage() {
        this.database = null;
        this.name = null;
        this.version = 1;
        this.schema = {
            1: {
                decomps: {
                    keys: ['writing'],
                    fields: {
                        atomic: 'boolean',
                        Children: 'object'
                    }
                },
                items: {
                    keys: ['id'],
                    fields: {
                        part: 'string',
                        vocabIds: 'array',
                        style: 'string',
                        timeStudied: 'string',
                        next: 'number',
                        last: 'number',
                        interval: 'number',
                        vocabListIds: 'array',
                        sectionIds: 'array',
                        review: 'number',
                        successes: 'number',
                        created: 'number',
                        changed: 'number',
                        previousSuccess: 'boolean',
                        previousInterval: 'number'
                    }
                },
                reviews: {
                    keys: ['itemId'],
                    fields: {
                        score: 'number',
                        bearTime: 'boolean',
                        submitTime: 'number',
                        reviewTime: 'number',
                        thinkingTime: 'number',
                        currentInterval: 'number',
                        actualInterval: 'number',
                        newInterval: 'number',
                        wordGroup: 'string',
                        previousInterval: 'number',
                        previousSuccess: 'boolean'
                    }
                },
                sentences: {
                    keys: ['id'],
                    fields: {
                        containedVocabIds: 'array',
                        definitions: 'object',
                        lang: 'string',
                        reading: 'string',
                        starred: 'boolean',
                        style: 'string',
                        toughness: 'number',
                        toughnessString: 'string',
                        writing: 'string'
                    }
                },
                srsconfigs: {
                    keys: ['part', 'lang'],
                    fields: {
                        initialRightInterval: 'number',
                        initialWrongInterval: 'number',
                        rightFactors: 'array',
                        wrongFactors: 'array'
                    }
                },
                strokes: {
                    keys: ['rune'],
                    fields: {
                        lang: 'string',
                        strokes: 'array'
                    }
                },
                vocabs: {
                    keys: ['id'],
                    fields: {
                        writing: 'string',
                        reading: 'string',
                        definitions: 'object',
                        customDefinitions: 'string',
                        lang: 'string',
                        audio: 'string',
                        rareKanji: 'boolean',
                        toughness: 'number',
                        toughnessString: 'string',
                        mnemonic: 'string',
                        starred: 'boolean',
                        style: 'string',
                        changed: 'number',
                        bannedParts: 'array',
                        containedVocabIds: 'array',
                        heisigDefinitions: 'string',
                        sentenceId: 'string',
                        topMnemonic: 'object'
                    }
                }

            }
        };
        this.schemaIndexedDB = {
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
                var reviews = transaction.createObjectStore('reviews', {keyPath: ['itemId', 'submitTime']});
                reviews.createIndex('score', 'score');
                reviews.createIndex('bearTime', 'bearTime');
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
        };
    }

    /**
     * @method getTable
     * @param {String} tableName The name of the table
     * @returns {Object} The object representing the specified table structure
     */
    Storage.prototype.getTable = function(tableName) {
        return this.schema[this.version][tableName];
    };

    /**
     * @method getTableFieldNames
     * @param {String} tableName The name of the table
     * @param {Boolean} excludeKeys Toggle whether or not to include the keys in the results
     * @returns {Array} An array of the field names
     */
    Storage.prototype.getTableFieldNames = function(tableName, excludeKeys) {
        var fieldNames = [];
        var table = this.schema[this.version][tableName];
        if (!excludeKeys)
            fieldNames = fieldNames.concat(table.keys);
        var fields = table.fields;
        for (var fieldName in fields) {
            fieldNames.push(fieldName);
        }
        return fieldNames;
    };

    /**
     * @method getTableKeys
     * @param {String} tableName The name of the table
     * @returns {Array} The array of keys in the table structure
     */
    Storage.prototype.getTableKeys = function(tableName) {
        return this.schema[this.version][tableName].keys;
    };

    /**
     * @method getTableNames
     * @returns {Array} A complete list of all the table names in the schema
     */
    Storage.prototype.getTableNames = function() {
        var tableNames = [];
        for (var tableName in this.schema[this.version]) {
            tableNames.push(tableName);
        }
        return tableNames;
    };


    return Storage;
});