/**
 * @module Skritter
 * @param Defn
 * @param Rdng
 * @param Rune
 * @param Tone
 * @param templateStudy
 * @author Joshua McFarland
 */
define([
    'prompts/Defn',
    'prompts/Rdng',
    'prompts/Rune',
    'prompts/Tone',
    'require.text!templates/study.html',
    'backbone'
], function(Defn, Rdng, Rune, Tone, templateStudy) {
    var Study = Backbone.View.extend({
        initialize: function() {
            Study.current = {prompt: null, item: null, vocabs: null};
            skritter.timer.sync(true);
        },
        render: function() {
            this.$el.html(templateStudy);
            this.$('#avatar').html(skritter.user.getAvatar('avatar'));
            this.$('#username').text(skritter.user.getSetting('name'));
            skritter.timer.setElement(this.$('#timer')).render();
            if (Study.current.prompt) {
                this.loadPrompt();
            } else {
                this.nextPrompt();
            }
            this.updateDueCount();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #study-view #add-button': 'addItems',
            'click.Study #study-view #audio-button': 'playAudio',
            'click.Study #study-view #info-button': 'navigateInfo'
        },
        /**
         * @method addItem
         */
        addItems: function() {
            var self = this;
            skritter.modal.show('progress').setTitle('Adding Items').setProgress(100);
            skritter.user.addItems(5, function() {
                self.updateDueCount();
                skritter.modal.hide();
            });
        },
        /**
         * @method handlePromptComplete
         * @param {Object} results
         */
        handlePromptComplete: function(results) {
            //runs a check to make sure multi-character reviews have contained items
            if (results.length > 1 && _.contains(_.pluck(results, 'item'), undefined)) {
                console.log('review error', results);
                Study.current.item.set({
                    flag: true,
                    flagMessage: "The contained items for this character don't exist.",
                    vocabIds: []
                });
            } else {
                var finalGrade = 3;
                var totalGrade = 0;
                var totalWrong = 0;
                var totalReviewTime = 0;
                var totalThinkingTime = 0;
                //create a unique word group for all of the prompt items to share
                var wordGroup = Study.current.item.get('id') + '_' + results[0].startTime;
                //update and calculate subitems
                if (results.length > 1) {
                    for (var i in results) {
                        var result = results[i];
                        if (result.grade < 2)
                            totalWrong++;
                        totalGrade += result.grade;
                        totalReviewTime += result.reviewTime;
                        totalThinkingTime += result.thinkingTime;
                        result.item.update(result.grade, result.reviewTime, result.startTime, result.thinkingTime, wordGroup, false);
                    }
                    //adjust the grade for multiple character items or get rounded down average
                    if (Study.current.vocabs[0].getCharacterCount() === 2 && totalWrong === 1) {
                        finalGrade = 1;
                    } else if (totalWrong >= 2) {
                        finalGrade = 1;
                    } else {
                        finalGrade = Math.floor(totalGrade / results.length);
                    }
                    Study.current.item.update(finalGrade, totalReviewTime, results[0].startTime, totalThinkingTime, wordGroup, true);
                } else {
                    Study.current.item.update(results[0].grade, results[0].reviewTime, results[0].startTime, results[0].thinkingTime, wordGroup, true);
                }
            }
            console.log('PROMPT COMPLETE', results);
            Study.current.prompt.undelegateEvents();
            
            //get the next item
            this.nextPrompt();
        },
        /**
         * @method loadPrompt
         */
        loadPrompt: function() {
            switch (Study.current.item.get('part')) {
                case 'rune':
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'tone':
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'defn':
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'rdng':
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
            }
            //toggle the audio button display
            this.toggleAudioButton();
            //show the in-progess prompt
            Study.current.prompt.show();
            //show the answer if it was marked as finished
            if (Study.current.prompt.isFinished())
                Study.current.prompt.showAnswer();
        },
        /**
         * @method loadPrompt
         * @returns {Boolean}
         */
        navigateInfo: function() {
            skritter.router.navigate('info/' + Study.current.vocabs[0].get('id'), {trigger: true});
            return false;
        },
        /**
         * @method nextItem
         * @returns {Backbone.View}
         */
        nextPrompt: function() {
            var self = this;
            //start a background sync if enabled and meets the threshold
            if (skritter.user.get('autoSync') && skritter.data.reviews.length > skritter.user.get('autoSyncThreshold'))
                skritter.user.sync();
            //load up the next item into the collections
            skritter.scheduler.getNext(function(item) {
                //keep an updated display of items due
                self.updateDueCount();
                //gets the next item and vocab that should be studied and loads it
                Study.current.item = item;
                Study.current.vocabs = Study.current.item.getVocabs();
                //load the based on the items part
                switch (Study.current.item.get('part')) {
                    case 'rune':
                        Study.current.prompt = new Rune();
                        break;
                    case 'tone':
                        Study.current.prompt = new Tone();
                        break;
                    case 'defn':
                        Study.current.prompt = new Defn();
                        break;
                    case 'rdng':
                        Study.current.prompt = new Rdng();
                        break;
                }
                //set the prompt values and start listening for completion
                Study.current.prompt.set(Study.current.vocabs, Study.current.item);
                self.listenToOnce(Study.current.prompt, 'complete', self.handlePromptComplete);
                self.loadPrompt();
            });
            return this;
        },
        /**
         * @method playAudio
         */
        playAudio: function() {
            Study.current.vocabs[0].play();
            return false;
        },
        /**
         * @method toggleAudioButton
         */
        toggleAudioButton: function() {
            if (Study.current.vocabs[0].has('audio')) {
                this.$('#audio-button').removeClass('fa fa-volume-off');
                this.$('#audio-button').addClass('fa fa-volume-up');
            } else {
                this.$('#audio-button').removeClass('fa fa-volume-up');
                this.$('#audio-button').addClass('fa fa-volume-off');
            }
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#items-due').text(skritter.scheduler.getDueCount());
        }
    });

    return Study;
});