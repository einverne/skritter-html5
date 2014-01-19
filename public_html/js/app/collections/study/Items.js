/**
 * @module Skritter
 * @submodule Collection
 * @param Item
 * @author Joshua McFarland
 */
define([
    'models/study/Item'
], function(Item) {
    /**
     * @class Items
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('add change', function(item) {
                skritter.scheduler.update(item);
                item.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method insert
         * @param {Array} items
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(items, callback) {
            if (items) {
                skritter.data.items.add(items, {merge: true, silent: true});
                skritter.storage.setItems('items', items, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method load
         * @param {String} id
         * @param {Function} callback
         */
        load: function(id, callback) {
            var item = this.get(id);
            if (item) {
                callback(item);
            } else {
                skritter.storage.getItems('items', id, _.bind(function(item) {
                    callback(this.add(item, {merge: true, silent: true})[0]);
                }, this));
            }
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', function(items) {
                skritter.data.items.add(items, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Items;
});