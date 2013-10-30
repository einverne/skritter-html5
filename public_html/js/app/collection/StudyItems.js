/**
 * @module Skritter
 * @submodule Collection
 * @param StudyItem
 * @author Joshua McFarland
 */
define([
    'model/StudyItem',
    'backbone'
], function(StudyItem) {
    /**
     * @class StudyItems
     */
    var StudyItems = Backbone.Collection.extend({
        /**
         * @property model
         * @type StudyItem
         */
        model: StudyItem,
        /**
         * @method cache
         * @param {Function} callback
         * @returns {undefined}
         */
        cache: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            Skritter.storage.setItems('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method comparator
         * @param {StudyItem} item
         * @returns {StudyItem}
         */
        comparator: function(item) {
            return -item.getReadiness();
        },
        /**
         * @method fetch
         * @param {Number} offset
         * @param {Function} callback
         * @returns {Array} Returns an array of objects
         */
        fetch: function(offset, callback) {
            var requests = [
                {
                    path: 'api/v0/items',
                    method: 'GET',
                    cache: false,
                    params: {
                        sort: (offset) ? 'changed' : 'last',
                        offset: (offset) ? offset : '',
                        include_vocabs: 'true',
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                }
            ];
            Skritter.async.waterfall([
                function(callback) {
                    Skritter.api.requestBatch(requests, function(result) {
                        callback(null, result);
                    });
                },
                function(result, callback) {
                    Skritter.api.getBatch(result.id, function(result) {
                        Skritter.study.decomps.add(result.Decomps);
                        Skritter.study.items.add(result.Items);
                        Skritter.study.srsconfigs.add(result.SRSConfigs);
                        Skritter.study.sentences.add(result.Sentences);
                        Skritter.study.strokes.add(result.Strokes);
                        Skritter.study.vocabs.add(result.Vocabs);
                    }, function() {
                        callback();
                    });
                }
            ], function() {
                callback();
            });
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('items', function(items) {
                Skritter.study.items.add(items);
                callback(null, items);
            });
        },
        /**
         * Returns a collection of items that are considered to be active for studying. Items that
         * are considered active must have the part enabled, contained vocabs and not be banned.
         * 
         * @method filterActive
         * @returns {StudyItems}
         */
        filterActive: function() {
            //filter items based on the user parts study settings
            var filtered = this.filterBy('part', Skritter.user.getStudyParts());
            //ISSUE #22: loads simplified and traditional chinese based on user settings
            if (Skritter.user.getSetting('targetLang') === 'zh') {
                var style = ['both'];
                if (Skritter.user.getSetting('reviewSimplified'))
                    style.push('simp');
                if (Skritter.user.getSetting('reviewTraditional'))
                    style.push('trad');
                filtered = filtered.filterBy('style', style);
            }
            filtered = filtered.filter(function(item) {
                //must contain vocabIds otherwise it's just a placeholder
                var contained = item.get('vocabIds');
                if (contained.length > 0) {
                    var vocab = item.getVocabs()[0];
                    //active items shouldn't be banned
                    if (!vocab.has('bannedParts'))
                        return true;
                }
                
            });
            return new StudyItems(filtered);
        },
        /**
         * @method filterBy
         * @param {String} attribute
         * @param {String} value
         * @param {Boolean} containsSubstring
         * @returns {StudyItems} A new collection of filtered StudyItems
         */
        filterBy: function(attribute, value, containsSubstring) {
            var filtered = this.filter(function(items) {
                if (containsSubstring) {
                    return (items.get(attribute).indexOf(value) > -1) ? true : false;
                }
                return _.contains(value, items.get(attribute));
            });
            return new StudyItems(filtered);
        },
        /**
         * @method getContainedItemIds
         * @returns {Array} An array of contained item ids
         */
        getContainedItemIds: function() {
            var items = [];
            for (var a in this.models) {
                var item = this.models[a];
                var vocabs = item.getVocabs();
                for (var b in vocabs) {
                    var contained = vocabs[b].get('containedVocabIds');
                    for (var c in contained) {
                        var id = Skritter.user.get('user_id') + '-' + contained[c] + '-' + item.get('part');
                        if (!_.contains(items, id)) {
                            items.push(id);
                        }
                    }
                }
            }
            return items;
        },
        /**
         * Returns a unique set of vocabs that are contained in all of the items.
         * 
         * @method getContainedVocabs
         * @returns {Array}
         */
        getContainedVocabs: function() {
            var containedVocabs = [];
            for (var a in this.models) {
                var vocabs = this.models[a].getVocabs();
                for (var b in vocabs) {
                    containedVocabs.push(vocabs[b]);
                }
            }
            return _.uniq(containedVocabs);
        },
        /**
         * Returns items that are actively being studied and have a readiness value
         * greater than or equal to 1.
         * 
         * @method getItemsDue
         * @returns {Array}
         */
        getDue: function() {
            var due = [];
            var filtered = this.filterActive();
            for (var i in filtered.models) {
                var item = filtered.models[i];
                if (item.getReadiness() >= 1)
                    due.push(item);
            }
            return due;
        },
        /**
         * Returns the number of items that are currently due. Optionally it can include contained items for
         * those rune and tone items. Returning the contained items is probably a better representation of
         * the actual amount of work that needs to be done.
         * 
         * @method getDueCount
         * @param {Boolean} includeContained
         * @returns {Number}
         */
        getDueCount: function(includeContained) {
            var items = this.getDue();
            if (includeContained) {
                var count = 0;
                for (var i in items) {
                    var item = items[i];
                    var part = item.get('part');
                    if (part === 'rune' || part === 'tone') {
                        count += item.getCharacterCount();
                    } else {
                        count++;
                    }
                }
                return count;
            }
            return items.length;
        },
        /**
         * Returns the item at the top of the sorted collection only including
         * items that are actively being studied.
         * 
         * @method getNext
         * @returns {StudyItem} The next item to be studied
         */
        getNext: function() {
            var filtered = this.filterActive();
            //TESTING: uncomment and adjust to filter and focus on specific items
            //filtered = filtered.filterBy('id', 'mcfarljwtest1-zh-嗯-0-rune');
            filtered = filtered.filterBy('part', Skritter.user.getStudyParts());
            var item = filtered.at(0);
            return item;
        },
        /**
         * Returns a random active study item.
         * 
         * @method getRandom
         * @returns {StudyItem}
         */
        getRandom: function() {
            var items = this.filterActive();
            //items = items.filterBy('part', Skritter.user.getStudyParts());
            //items = items.filterBy('part', ['rune']);
            //items = items.filterBy('id', ['mcfarljwtest1-zh-工人-0-rune']);
            return items.at(Skritter.fn.getRandomInt(0, items.length-1));
        }
    });


    return StudyItems;
});