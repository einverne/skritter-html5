/**
 * @module Skritter
 * @submodule Collection
 * @param StudyItem
 * @author Joshua McFarland
 */
define([
    'models/StudyItem',
    'backbone'
], function(StudyItem) {
    /**
     * @class StudyItems
     */
    var StudyItems = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(item) {
                item.cache();
            });
        },
        /**
         * @property model
         * @type StudyItem
         */
        model: StudyItem,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method comparator
         * @param {StudyItem} item
         * @returns {StudyItem}
         */
        /*comparator: function(item) {
            return -item.getReadiness();
        },*/
        /**
         * @method filterBy
         * @param {String} attribute
         * @param {String} value
         * @param {Boolean} checkSubString
         * @returns {Array}
         */
        filterBy: function(attribute, value, checkSubString) {
            var filtered = this.filter(function(items) {
                if (checkSubString)
                    return (items.get(attribute).indexOf(value) > -1) ? true : false;
                return _.contains(value, items.get(attribute));
            });
            return new StudyItems(filtered);
        },
        /**
         * @method getActive
         * @returns {Array}
         */
        getActive: function() { 
            var activeItems = [];
            var activeStudyParts = skritter.user.getActiveStudyParts();
            for (var i in this.models) {
                var item = this.models[i];
                var part = '';
                if (item.has('part')) {
                    part = item.get('part');
                } else {
                    part = item.get('id').split('-')[4];
                }
                if (activeStudyParts.indexOf(part) !== -1 && item.get('vocabIds').length > 0)
                    activeItems.push(item);
            }
            return activeItems;
        },
        /**
         * @method getContainedIds
         */
        getContainedIds: function() {
            var containedItems = [];
            for (var i in this.models) {
                var contained = this.models[i].getContainedIds();
                if (contained.length > 0)
                    containedItems = containedItems.concat(contained);
            }
            return _.uniq(containedItems);
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            var itemsDue = [];
            var activeItems = this.getActive();
            for (var i in activeItems)
                if (activeItems[i].getReadiness() >= 1)
                    itemsDue.push(activeItems[i]);
            return itemsDue;
        },
        /**
         * @method getNextIds
         * @param {Number} limit
         * @returns {Array}
         */
        getNextIds: function(limit) {
            var ids = [];
            limit = (limit) ? limit : 100;
            var items = this.slice(0, limit);
            for (var a in items) {
                ids.push(items[a].get('id'));
                if (items[a].has('containedVocabIds')) {
                    var containedVocabsIds = items[a].get('containedVocabIds');
                    for (var b in containedVocabsIds)
                        ids.push(skritter.user.get('user_id') + '-' + containedVocabsIds[b]);
                }
            }
            return _.uniq(ids);
        },
        /**
         * @method insert
         * @param {Array} items
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(items, callback) {
            this.add(items, {merge: true, sort: false});
            skritter.storage.setItems('items', items, callback);
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', function(items) {
                skritter.data.items.add(items, {silent: true, sort: false});
                callback(null, items);
            });
        },
        /**
         * @method loadItem
         * @param {Array} ids
         * @param {Number} limit
         * @param {Function} callback
         * @returns {Backbone.Model}
         */
        loadItems: function(ids, limit, callback) {
            if (ids) {
                ids = Array.isArray(ids) ? ids : [ids];
            } else {
                ids = [];
            }
            if (limit)
                ids = ids.slice(0, limit);
            skritter.async.series([
                function(callback) {
                        skritter.storage.getItems('items', _.pluck(ids, 'id'), function(items) {
                            skritter.data.items.add(_.remove(items, undefined), {silent: true, sort: false});
                            callback();
                        });
                },
                function(callback) {
                    skritter.storage.getItems('items', skritter.data.items.getContainedIds(), function(items) {
                        skritter.data.items.add(_.remove(items, undefined), {silent: true, sort: false});
                        callback();
                    });
                }
            ], function() {
                callback();
            });
        }
    });

    return StudyItems;
});