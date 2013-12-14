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
            this.on('add', function(item) {
                item.cache();
            });
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
        comparator: function(item) {
            return -item.getReadiness();
        },
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
            //filter out any lang and parts that aren't currently being studied
            var activeItems = this.filterBy('lang', skritter.user.getSetting('targetLang')).filterBy('part', skritter.user.getActiveStudyParts());
            //for Chinese style needs to be filtered based on simp, trad or both
            if (skritter.user.getSetting('targetLang') === 'zh') {
                var style = [];
                if (skritter.user.getSetting('reviewSimplified') && skritter.user.getSetting('reviewTraditional'))
                    style.push('both');
                if (skritter.user.getSetting('reviewSimplified'))
                    style.push('simp');
                if (skritter.user.getSetting('reviewTraditional'))
                    style.push('trad');
            }
            //apply other filters to return a true subset of active items
            return new StudyItems(activeItems.filter(function(item) {
                var vocabIds = item.get('vocabIds');
                if (vocabIds.length > 0)
                    return true;
            }));
        },
        /**
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            return this.getActive().filter(function(item) {
                return item.getReadiness(true) >= 1;
            });
        },
        /**
         * @method insert
         * @param {Array} items
         * @param {Function} callback
         */
        insert: function(items, callback) {
            skritter.storage.setItems('items', items, callback);
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', function(items) {
                skritter.data.items.add(items, {silent: true});
                callback(null, items);
            });
        }
    });

    return StudyItems;
});