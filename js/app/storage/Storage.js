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
                log: {
                    keys: ['id'],
                    fields: {
                        userId: 'string',
                        timestamp: 'number',
                        data: 'object'
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