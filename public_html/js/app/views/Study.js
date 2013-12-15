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
                this.nextItem();
            }
            this.updateDueCount();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #add-button': 'addItems',
            'click.Study #audio-button': 'playAudio',
            'click.Study #info-button': 'navigateInfo'
        },
        /**
         * @method addItem
         */
        addItems: function() {
            var self = this;
            skritter.modal.show('progress').setTitle('Adding Items').setProgress(100);
            skritter.user.addItems(1, function() {
                self.loadItems();
                self.updateDueCount();
                skritter.modal.hide();
            });
        },
        /**
         * @method handlePromptComplete
         * @param {Object} results
         */
        handlePromptComplete: function(results) {
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
            console.log('PROMPT COMPLETE', results);
            Study.current.prompt.undelegateEvents();
            this.nextItem();
        },
        /**
         * @method loadItems
         * @param {String} attribute
         * @param {Array} values
         * @param {Boolean} autoLoad
         * @returns {Backbone.Collection}
         */
        loadItems: function(attribute, values, autoLoad) {
            if (attribute && values) {
                Study.items = skritter.data.items.filterBy(attribute, values).filterBy('lang', skritter.user.getSetting('targetLang'));
                if (Study.items.length < 1)
                    return false;
                if (autoLoad)
                    this.nextItem();
            } else {
                Study.items = skritter.data.items.getActive();
                
            }
            return Study.items;
        },
        /**
         * @method loadPrompt
         */
        loadPrompt: function() {
            console.log('Resuming', Study.current.vocabs[0].get('writing'));
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
         * @returns {Object}
         */
        nextItem: function() {
            //resort the items based on the new readiness values
            skritter.data.items.sort();
            //keep an updated display of items due
            this.updateDueCount();
            //gets the next item that should be studied and loads it
            Study.current.item = skritter.data.items.at(0);
            //Study.current.item = skritter.data.items.findWhere({id: 'mcfarljwtest1-zh-的-0-tone'});
            Study.current.vocabs = Study.current.item.getVocabs();
            //load the basd on the items part
            switch (Study.current.item.get('part')) {
                case 'rune':
                    Study.current.prompt = new Rune();
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'tone':
                    Study.current.prompt = new Tone();
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'defn':
                    Study.current.prompt = new Defn();
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'rdng':
                    Study.current.prompt = new Rdng();
                    Study.current.prompt.setElement(this.$('#prompt-container')).render();
                    break;
            }
            //toggle the audio button display
            this.toggleAudioButton();
            //set the prompt values and start listening for completion
            Study.current.prompt.set(Study.current.vocabs, Study.current.item).show();
            this.listenToOnce(Study.current.prompt, 'complete', this.handlePromptComplete);
            return Study.current;
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
           this.$('#items-due').text(skritter.data.items.getDue().length); 
        }
    });

    return Study;
});