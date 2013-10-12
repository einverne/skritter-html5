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
         * @method filterActive
         * @returns {StudyItems} A new collection of active StudyItems
         */
        filterActive: function() {
            var filtered = this.filter(function(items) {
                if (items.get('vocabIds').length > 0)
                    return true;
            });
            return new StudyItems(filtered);
        },
        /**
         * @method filterBy
         * @param {String} attribute
         * @param {String} value
         * @returns {StudyItems} A new collection of filtered StudyItems
         */
        filterBy: function(attribute, value) {
            var filtered = this.filter(function(items) {
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
                        var id = Skritter.user.get('id') + '-' + contained[c] + '-' + item.get('part');
                        if (!_.contains(items, id)) {
                            items.push(id);
                        }
                    }
                }
            }
            return items;
        },
        /**
         * @method getItemsDue
         * @returns {Number} The number of active items ready to be studied
         */
        getItemsDue: function() {
            var count = 0;
            for (var i in this.models) {
                var item = this.models[i];
                //console.log(item.get('id'), item.getReadiness());
                if (item.isActive() && item.getReadiness(true) >= 1)
                    count++;
            }
            return count;
        },
        /**
         * @method getNext
         * @returns {StudyItem} The next item to be studied
         */
        getNext: function() {
            var filtered = this.getStudy();
            var item = filtered.at(0);
            return item;
        },
        getRandom: function() {
            var items = this.filterActive();
            items = items.filterBy('part', ['rune']);
            return items.at(Skritter.fn.getRandomInt(0, items.length-1));
        },
        /**
         * @method getStudy
         * @returns {StudyItems} A new collection of StudyItems filter by parts being studied
         */
        getStudy: function() {
            var items = this.filterActive();
            //return items.filterBy('part', Skritter.user.getStudyParts());
            return items.filterBy('id', ['mcfarljwtest1-zh-现代-0-rune']);
            //return items.filterBy('parts', ['rune']);
        }
    });


    return StudyItems;
});