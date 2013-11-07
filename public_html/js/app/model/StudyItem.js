/**
 * @module Skritter
 * @submodule Model
 * @param Scheduler
 * @param StudyReview
 * @author Joshua McFarland
 * 
 * Properties
 * id
 * part
 * vocabIds
 * style
 * timeStudied
 * next
 * last
 * interval
 * vocabListIds
 * sectionIds
 * reviews
 * successes
 * created
 * changed
 * previousSuccess
 * previousInterval
 * 
 */
define([
    'Scheduler',
    'model/StudyReview',
    'backbone'
], function(Scheduler, StudyReview) {
    /**
     * @class StudyItem
     */
    var StudyItem = Backbone.Model.extend({
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            Skritter.storage.setItem('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getCharacterCount
         * @returns {Number}
         */
        getCharacterCount: function() {
            return this.getVocabs()[0].getCharacterCount();
        },
        /**
         * @method getContained
         * @return {Array}
         */
        getContained: function() {
            var items = [];
            var contained = this.getVocabs()[0].get('containedVocabIds');
            for (var i in contained)
            {
                var id = Skritter.user.get('user_id') + '-' + contained[i] + '-' + this.get('part');
                var item = Skritter.data.items.findWhere({id: id});
                if (item)
                    items.push(item);
            }
            return items;
        },
        /**
         * @method getReadiness
         * @return {Number}
         */
        getReadiness: function() {
            //todo: make this more robust
            var readiness = (Skritter.fn.getUnixTime() - this.get('last')) / (this.get('next') - this.get('last'));
            return readiness;
        },
        /**
         * @method getVocabs
         * @return {Array}
         */
        getVocabs: function() {
            var vocabs = [];
            for (var i in this.get('vocabIds'))
            {
                vocabs.push(Skritter.data.vocabs.findWhere({id: this.get('vocabIds')[i]}));
            }
            return vocabs;
        },
        /**
         *
         * 
         * @method isActive
         * @return {Boolean}
         */
        isActive: function() {
            if (this.get('vocabIds').length > 0)
                return true;
            return false;
        },
        /**
         * Returns true if the item is considered to be new. An item is considered to be new
         * if it doesn't have a previousInterval or it's never has a successful review.
         * 
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            if (this.get('previousInterval') === 0 || this.get('successes') === 0)
                return true;
            return false;
        },
        /**
         * @method play
         * @return {undefined}
         */
        play: function() {
            var vocab = this.getVocabs()[0];
            vocab.play();
        }
    });


    return StudyItem;
});