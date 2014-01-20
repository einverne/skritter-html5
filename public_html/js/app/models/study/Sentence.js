/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'PinyinConverter'
], function(PinyinConverter) {
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
         * @method getDefinition
         * @returns {String}
         */
        getDefinition: function() {
            var definition = this.get('definitions')[skritter.user.getSetting('sourceLang')];
            if (typeof definition === 'undefined')
                return this.get('definitions').en;
            if (definition)
                return definition;
            return null;
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return PinyinConverter.toTone(this.get('reading'));
        },
        /**
         * @method getWriting
         * @param {Booolean} whitespaces
         * @returns {String}
         */
        getWriting: function(whitespaces) {
            if (whitespaces)
                return this.get('writing');
            return this.get('writing').replace(/\s/g, '');
        }
    });

    return Sentence;
});