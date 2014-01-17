/**
 * @module Skritter
 * @param PromptItem
 * @author Joshua McFarland
 */
define([
    'models/study/PromptItem'
], function(PromptItem) {
    /**
     * @class PromptData
     */
    var PromptData = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            PromptData.this = this;
            this.id = null;
            this.item = null;
            this.position = 1;
            this.vocab =  null;
        },
        /**
         * @property {Backbone.Model} model
         */
        model: PromptItem,
        /**
         * @method getContainedItems
         * @param {Boolean} includeBase
         * @returns {Array}
         */
        getContainedItems: function(includeBase) {
            var contained = [];
            for (var i in this.models)
                if (this.models[i].id > 0 || includeBase)
                    contained.push(this.models[i].item());
            return contained;
        },
        /**
         * @method getContainedReviews
         * @param {Boolean} includeBase
         * @returns {Array}
         */
        getContainedReviews: function(includeBase) {
            var contained = [];
            for (var i in this.models)
                if (this.models[i].id > 0 || includeBase)
                    contained.push(this.models[i].review());
            return contained;
        },
        /**
         * @method getDataItem
         * @returns {Backbone.Model}
         */
        getDataItem: function() {
            return this.get(this.position);
        },
        /**
         * @method getTotalGrade
         * @returns {Number}
         */
        getFinalGrade: function() {
            var finalGrade = 3;
            var contained = this.getContainedReviews();
            if (contained.length === 1) {
                finalGrade = this.contained[0].get('score');
            } else {
                var totalGrade = this.getTotalGrade();
                var totalWrong = this.getTotalWrong();
                if (this.getMaxPosition() === 2 && totalWrong === 1) {
                    finalGrade = 1;
                } else if (totalWrong >= 2) {
                    finalGrade = 1;
                } else {
                    finalGrade = Math.floor(totalGrade / this.getMaxPosition());
                }
            }
            return finalGrade;
        },
        /**
         * @method getMaxPosition
         * @returns {Number}
         */
        getMaxPosition: function() {
            var maxCount = 0;
            for (var i in this.models)
                if (this.models[i].get('position') > 0)
                    maxCount++;
            return maxCount;
        },
        /**
         * @method getStartTime
         * @returns {Number}
         */
        getStartTime: function() {
            return this.get(1).review().get('submitTime');
        },
        /**
         * @method getTotalGrade
         * @returns {Number}
         */
        getTotalGrade: function() {
            var totalGrade = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                totalGrade += contained[i].get('score');
            return totalGrade;
        },
        /**
         * @method getTotalReviewTime
         * @returns {Number}
         */
        getTotalReviewTime: function() {
            var totalReviewTime = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                totalReviewTime += contained[i].get('reviewTime');
            return totalReviewTime;
        },
        /**
         * @method getTotalThinkingTime
         * @returns {Number}
         */
        getTotalThinkingTime: function() {
            var totalThinkingTime = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                totalThinkingTime += contained[i].get('thinkingTime');
            return totalThinkingTime;
        },
        /**
         * @method getTotalWrong
         * @returns {Number}
         */
        getTotalWrong: function() {
            var totalWrong = 0;
            var contained = this.getContainedReviews();
            for (var i in contained)
                if (contained[i].get('score') < 2)
                    totalWrong++;
            return totalWrong;
        },
        /**
         * @property {Object} hide
         */
        hide: {
            definition: function() {
                $('.prompt-definition').hide();
            },
            mnemonic: function() {
                $('.prompt-mnemonic').hide();
            },
            reading: function() {
                $('.prompt-reading').hide();
            },
            sentence: function() {
                $('.prompt-sentence').hide();
            },
            writing: function() {
                $('.prompt-writing').hide();
            }
        },
        /**
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            if (this.position <= 1)
                return true;
            return false;
        },
        /**
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            if (this.position >= this.getMaxPosition())
                return true;
            return false;
        },
        /**
         * @method next
         * @returns {Number}
         */
        next: function() {
            if (!this.isLast())
                this.position++;
            return this.position;
        },
        /**
         * @method previous
         * @returns {Number}
         */
        previous: function() {
            if (!this.isFirst())
                this.position--;
            return this.position;
        },
        /**
         * @method save
         * @returns {Backbone.Collection}
         */
        save: function() {
            if (this.getMaxPosition() > 1)
                this.get(0).setReview(this.getFinalGrade(), this.getTotalReviewTime(), this.getTotalThinkingTime(), this.getStartTime());
            skritter.data.items.add(this.getContainedItems(true), {merge: true});
            skritter.data.reviews.add(this.getContainedReviews(true), {merge: true});
            return this;
        },
        /**
         * @property {Object} show
         */
        show: {
            definition: function() {
                $('.prompt-definition').html(PromptData.this.vocab.getDefinition());
                $('.prompt-definition').show();
            },
            mnemonic: function() {
                $('.prompt-mnemonic').html(PromptData.this.vocab.get('mnemonic').text + ' (' + PromptData.this.vocab.get('mnemonic').creator + ')');
                $('.prompt-mnemonic').show();
            },
            reading: function() {
                $('.prompt-reading').html(PromptData.this.vocab.getReading());
                $('.prompt-reading').show();
            },
            readingAt: function(offset) {
                offset = (offset) ? offset : 0;
                $('.prompt-reading').html(PromptData.this.vocab.getReadingDisplay(PromptData.this.position + offset));
                $('.prompt-reading').show();
            },
            sentence: function() {
                if (PromptData.this.vocab.getSentence()) {
                    $('.prompt-sentence').html(PromptData.this.vocab.getSentence().getWriting());
                    $('.prompt-sentence').show();
                } else {
                    PromptData.this.hide.sentence();
                }
            },
            sentenceMasked: function() {
                if (PromptData.this.vocab.getSentence()) {
                    $('.prompt-sentence').html(skritter.fn.maskCharacters(PromptData.this.vocab.getSentence().getWriting(), PromptData.this.vocab.get('writing'), '__'));
                    $('.prompt-sentence').show();
                } else {
                    PromptData.this.hide.sentence();
                }
            },
            writing: function() {
                $('.prompt-writing').html(PromptData.this.vocab.get('writing'));
                $('.prompt-writing').show();
            },
            writingAt: function(offset) {
                offset = (offset) ? offset : 0;
                $('.prompt-writing').html(PromptData.this.vocab.getWritingDisplay(PromptData.this.position + offset));
                $('.prompt-writing').show();
            }
        }
    });
    
    return PromptData;
}); 