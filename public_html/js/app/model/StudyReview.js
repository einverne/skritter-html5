/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 * 
 * Properties
 * itemId
 * score
 * bearTime
 * submitTime
 * reviewTime
 * thinkingTime
 * currentInterval
 * actualInterval
 * newInterval
 * wordGroup
 * previousInterval
 * previousSuccess
 * 
 */
define([
    'backbone'
], function() {
    /**
     * @class StudyReview
     */
    var StudyReview = Backbone.Model.extend({
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            Skritter.storage.setItem('reviews', this.toJSON(), function() {
                console.log('review added');
                if (typeof callback === 'function')
                    callback();
            });
        }

    });


    return StudyReview;
});