/**
 * @module Skritter
 * @submodule Collections
 * @param Item
 * @param Vocabs
 * @author Joshua McFarland
 */
define([
    'models/study/Item',
    'collections/study/Vocabs'
], function(Item, Vocabs) {
    /**
     * @class Items
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Items.this = this;
            this.on('change', function(item) {
                item.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item
    });

    return Items;
});