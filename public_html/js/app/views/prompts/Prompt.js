/**
 * @module Skritter
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'views/prompts/GradingButtons'
], function(GradingButtons) {
    /**
     * @method Prompt
     */
    var Prompt = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.this = this;
            Prompt.data = null;
            Prompt.dataItem = null;
            Prompt.gradingButtons = new GradingButtons();
            Prompt.gradeColorHex = {
                1: '#e68e8e',
                2: '#d95757',
                3: '#70da70',
                4: '#4097d3'
            };
            Prompt.gradeColorFilters = {
                1: new createjs.ColorFilter(0, 0, 0, 1, 230, 142, 142, 1),
                2: new createjs.ColorFilter(0, 0, 0, 1, 217, 87, 87, 1),
                3: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1),
                4: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1)
            };
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradeSelected);
        },
        /**
         * @method render
         * @return {Backbone.View}
         */
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            this.$('.prompt-writing').addClass(Prompt.data.vocab.getTextStyleClass());
            this.$('.prompt-sentence').addClass(Prompt.data.vocab.getTextStyleClass());
            this.$('.font-size-normal').css({'font-size': skritter.settings.fontSize.normal()});
            this.$('.font-size-large').css({'font-size': skritter.settings.fontSize.large()});
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Prompt .prompt #prompt-previous': 'previous',
            'click.Prompt .prompt #prompt-next': 'handleGradeSelected'
        },
        data: function() {
            return Prompt.data;
        },
        /**
         * @method handleGradeSelected
         */
        handleGradeSelected: function() {
            Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
            console.log('GRADING', Prompt.dataItem.review());
            this.next();
        },
        /**
         * @method load
         */
        load: function() {
            console.log('PROMPT ITEM', Prompt.dataItem);
            if (Prompt.data.isFirst()) {
                this.$('#prompt-previous').hide();
            } else {
                this.$('#prompt-previous').show();
            }
            if (Prompt.dataItem.isFinished()) {
                this.$('#prompt-next').show();
            } else {
                this.$('#prompt-next').hide();
            }
        },
        /**
         * @method next
         */
        next: function() {
            if (Prompt.data.isLast()) {
                this.triggerComplete();
            } else {
                Prompt.data.next();
                Prompt.dataItem = Prompt.data.getDataItem();
                skritter.timer.reset();
                this.clear();
                this.redraw();
                this.load();
            }
        },
        /**
         * @method previous
         */
        previous: function() {
            if (!Prompt.data.isFirst()) {
                Prompt.data.previous();
                Prompt.dataItem = Prompt.data.getDataItem();
                this.clear();
                this.redraw();
                this.load();
            } else {
                
            }
        },
        /**
         * @method resize
         * @param {Object} size
         */
        resize: function(size) {
            size = (size) ? size : {};
            size.width = (size.width) ? size.width : skritter.settings.get('appWidth');
            size.height = (size.height) ? size.height : skritter.settings.get('appHeight');
            size.canvas = (size.canvas) ? size.canvas : skritter.settings.get('canvasSize');
            this.$('#input-container').width(size.canvas);
            this.$('#input-container').height(size.canvas);
            //manually resizes the info section to fill vertical mobile devices
            if (size.width <= 601 && skritter.settings.get('orientation') === 'vertical') {
                this.$('#info-container').height(size.height - $('.navbar').height() - size.canvas - 40);
                this.$('#info-container').width('');
            } else {
                //manually resizes the info section to fill horizontal mobile devices
                if (size.height <= 601 && size.width > 601) {
                    this.$('#info-container').height(size.canvas);
                    this.$('#info-container').width(size.width - size.canvas - 32);
                } else {
                    this.$('#info-container').height('');
                }
            }
        },
        /**          
         * @method set
         * @param {Object} data
         */
        set: function(data) {
            console.log('PROMPT DATA', data);
            Prompt.data = data;
            Prompt.dataItem = Prompt.data.getDataItem();
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            Prompt.data.save();
            this.trigger('complete', Prompt.data);
        }
    });
    
    return Prompt;
});