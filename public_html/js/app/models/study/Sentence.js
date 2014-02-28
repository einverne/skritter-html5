/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Sentence
     */
    var Sentence = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('sentence', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method reading
         * @returns {String}
         */
        reading: function() {
            return skritter.fn.pinyin.toTone(this.get('reading'));
        }
    });

    return Sentence;
});