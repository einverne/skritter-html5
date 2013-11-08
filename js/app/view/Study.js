/**
 * @module Skritter
 * @submodule View
 * @param Scheduler
 * @param StudyReview
 * @param PromptRune
 * @param PromptTone
 * @param PromptDefn
 * @param PromptRdng
 * @param templateStudy
 * @author Joshua McFarland
 */
define([
    'Scheduler',
    'model/StudyReview',
    'prompt/PromptRune',
    'prompt/PromptTone',
    'prompt/PromptDefn',
    'prompt/PromptRdng',
    'require.text!template/study.html',
    'backbone'
], function(Scheduler, StudyReview, PromptRune, PromptTone, PromptDefn, PromptRdng, templateStudy) {
    /**
     * @class StudyView
     */
    var Study = Backbone.View.extend({
        initialize: function() {
            Study.c = {prompt: null, item: null, vocabs: null};
            Study.items = {};
            Study.scheduler = new Scheduler();
        },
        /**
         * @method render
         * @return {StudyView}
         */
        render: function() {
            this.$el.html(templateStudy);
            this.updateDue();
            Skritter.timer.setElement(this.$('#timer')).render();
            this.loadItems();
            this.next();
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #info-button': 'showInfo',
            'click.Study #audio-button': 'playAudio'
        },
        /**
         * @method handlePromptComplete
         * @param {Object} results
         */
        handlePromptComplete: function(results) {
            this.updateItems(results);
            this.updateDue();
            Skritter.data.items.sort();
            this.next();
        },
        /**
         * Loads the selected items into the study session. If nothing is set then
         * it'll just load the current active items.
         * 
         * @method loadPrompt
         * @param {String} itemAttr
         * @param {Array} itemVals
         * @returns {StudyItem}
         */
        loadItems: function(itemAttr, itemVals) {
            if (itemAttr && itemVals) {
                Study.items = Skritter.data.items.filterBy(itemAttr, itemVals);
                if (Study.items.length < 1)
                    return false;
                this.next();
            } else {
                Study.items = Skritter.data.items.filterActive();
            }
            return Study.items;
        },
        /**
         * @method next
         * @returns {Object}
         */
        next: function() {
            //force loads items if they haven't already been
            if (Study.items.length === 0)
                this.loadItems();
            //resort the items based on the new readiness values
            Study.items.sort();
            //gets the next item that should be studied and loads it
            Study.c.item = Study.items.getNext();
            //integrity check to make sure something loaded
            if (!Study.c.item) {
                alert("Something didn't quite load properly!");
                console.log('Prompt Load Failed', Study.c);
                window.location.hash = '';
            }
            //load the vocabs if there are no problems
            Study.c.vocabs = Study.c.item.getVocabs();
            switch (Study.c.item.get('part')) {
                case 'rune':
                    Study.c.prompt = new PromptRune();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'tone':
                    Study.c.prompt = new PromptTone();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'defn':
                    Study.c.prompt = new PromptDefn();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'rdng':
                    Study.c.prompt = new PromptRdng();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
            }
            //toggle the audio button display
            if (Study.c.vocabs[0].has('audio')) {
                this.$('#audio-button').text('{audio}');
            } else {
                this.$('#audio-button').text('{no-audio}');
            }
            Study.c.prompt.set(Study.c.vocabs).show();
            this.listenToOnce(Study.c.prompt, 'complete', this.handlePromptComplete);
            return Study.c;
        },
        playAudio: function() {
            Study.c.vocabs[0].play();
            return true;
        },
        /**
         * @method showInfo
         */
        showInfo: function() {
            document.location.hash = 'info/' + Study.c.vocabs[0].get('id');
        },
        /**
         * @method resize
         */
        resize: function() {
            var bottom = {width: this.$('#prompt-bottom').width(), height: this.$('#prompt-bottom').height()};
            if (Skritter.settings.get('orientation') === 'vertical') {
                this.$('#prompt-top').height(Skritter.settings.get('appHeight') - bottom.height);
            }
        },
        /**
         * @method updateDue
         */
        updateDue: function() {
            this.$('#items-due').text(Skritter.data.items.getDueCount(true));
        },
        /**
         * @method updateItems
         * @param {Object} results
         */
        updateItems: function(results) {
            console.log('RESULTS', results);
            var reviews = [];
            //handles rune and tone reviews that contain multiple items
            if (results.length > 1) {
                var contained = Study.c.item.getContained();
                var subReview;
                //loop through the contained items and create reviews for them too
                for (var a in results) {
                    var subItem = contained[a];
                    var result = results[a];
                    //first we need to update the reviews
                    subReview = new StudyReview({
                        itemId: subItem.get('id'),
                        score: parseInt(result.grade, 10),
                        bearTime: false,
                        submitTime: result.startTime,
                        reviewTime: result.reviewTime,
                        thinkingTime: result.thinkingTime,
                        currentInterval: subItem.get('interval'),
                        actualInterval: result.startTime - subItem.get('last'),
                        newInterval: Study.scheduler.getInterval(subItem, result.grade),
                        wordGroup: Study.c.vocabs[0].get('writing') + '_' + results[0].startTime,
                        previousInterval: (subItem.get('previousInterval')) ? subItem.get('previousInterval') : 0,
                        previousSuccess: (subItem.get('previousSuccess')) ? subItem.get('previousSuccess') : false
                    });
                    //next we need to update the item
                    subItem.set({
                        changed: result.startTime,
                        last: result.startTime,
                        next: result.startTime + subReview.get('newInterval'),
                        interval: subReview.get('newInterval'),
                        previousInterval: subItem.get('interval'),
                        previousSuccess: (result.grade > 1) ? true : false,
                        reviews: subItem.get('reviews') + 1,
                        successes: (result.grade > 1) ? subItem.get('successes') + 1 : subItem.get('successes')
                    });
                    reviews.push(subReview);
                }
            }
            //calculate the total results for the entire item
            var finalGrade = 0;
            var total = 0;
            var totalReviewTime = 0;
            var totalThinkingTime = 0;
            var wrongCount = 0;
            for (var i in results) {
                total += parseInt(results[i].grade, 10);
                totalReviewTime += results[i].reviewTime;
                totalThinkingTime += results[i].thinkingTime;
                if (parseInt(results[i].grade, 10) === 1)
                    wrongCount++;
            }
            //adjust the grade for multiple character items or get rounded down average
            if (Study.c.vocabs[0].getCharacterCount() === 2 && wrongCount === 1) {
                finalGrade = 1;
            } else if (wrongCount >= 2) {
                finalGrade = 1;
            } else {
                finalGrade = Math.floor(total / results.length);
            }
            var review = new StudyReview({
                itemId: Study.c.item.get('id'),
                score: parseInt(finalGrade, 10),
                bearTime: true,
                submitTime: results[0].startTime,
                reviewTime: totalReviewTime,
                thinkingTime: totalThinkingTime,
                currentInterval: Study.c.item.get('interval'),
                actualInterval: results[0].startTime - Study.c.item.get('last'),
                newInterval: Study.scheduler.getInterval(Study.c.item, finalGrade),
                wordGroup: Study.c.vocabs[0].get('writing') + '_' + results[0].startTime,
                previousInterval: (Study.c.item.get('previousInterval')) ? Study.c.item.get('previousInterval') : 0,
                previousSuccess: (Study.c.item.get('previousSuccess')) ? Study.c.item.get('previousSuccess') : false
            });
            Study.c.item.set({
                changed: results[0].startTime,
                last: results[0].startTime,
                next: results[0].startTime + review.get('newInterval'),
                interval: review.get('newInterval'),
                previousInterval: Study.c.item.get('interval'),
                previousSuccess: (results[0].grade > 1) ? true : false,
                reviews: Study.c.item.get('reviews') + 1,
                successes: (results[0].grade > 1) ? Study.c.item.get('successes') + 1 : Study.c.item.get('successes')
            });
            reviews.push(review);
            Skritter.data.reviews.add(reviews);
        }
    });


    return Study;
});