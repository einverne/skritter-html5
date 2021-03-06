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
                2: '#efec10',
                3: '#70da70',
                4: '#4097d3'
            };
            Prompt.gradeColorFilters = {
                1: new createjs.ColorFilter(0, 0, 0, 1, 230, 142, 142, 1),
                2: new createjs.ColorFilter(0, 0, 0, 1, 239, 236, 16, 1),
                3: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1),
                4: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1)
            };
            Prompt.teachingMode = true;
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
            hammer(this.$('#prompt-next')[0]).on('tap', this.next);
            hammer(this.$('#prompt-previous')[0]).on('tap', this.previous);
            this.resize();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Prompt .prompt .prompt-reading-show-button': 'showReading'
        },
        /**
         * @method data
         * @return {Backbone.Collection}
         */
        data: function() {
            return Prompt.data;
        },
        /**
         * @method handleGradeSelected
         */
        handleGradeSelected: function() {
            skritter.log.console('GRADING', Prompt.dataItem.review());
        },
        /**
         * @method load
         */
        load: function() {
            skritter.log.console('PROMPT ITEM', Prompt.data, Prompt.dataItem);
            Prompt.gradingButtons.grade(Prompt.dataItem.getGrade());
            //TODO: unhide these options for traversing
            this.$('#prompt-next').hide();
            this.$('#prompt-previous').hide();
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
                if (!Prompt.dataItem.isFinished()) {
                    skritter.timer.reset();
                    this.reset();
                }
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
                this.triggerPrevious();
            }
        },
        /**
         * @method redraw
         */
        redraw: function() {
            //used if redraw function is consistent across all prompts
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
            size.navbar = (size.navbar) ? size.navbar : Prompt.this.$('.navbar').height();
            Prompt.this.$('#canvas-holder').width(size.canvas);
            Prompt.this.$('#canvas-holder').height(size.canvas);
            //manually resizes the info section to fill vertical mobile devices
            if (skritter.settings.get('orientation') === 'portrait') {
                Prompt.this.$('#info-container').height(size.height - size.canvas - 50);
                Prompt.this.$('#info-container').width('');
                Prompt.this.$('#input-container').width(size.width);
                Prompt.this.$('#input-container').height(size.canvas);
            } else {
                var calculatedWidth = size.width - size.canvas - 32;
                if (calculatedWidth > 500) {
                    Prompt.this.$('#info-container').width(500);
                } else {
                    Prompt.this.$('#info-container').width(calculatedWidth);
                }
                Prompt.this.$('#info-container').height(size.height - 50);
                Prompt.this.$('#input-container').width('');
                Prompt.this.$('#input-container').height(size.height - 50);
            }
            Prompt.this.redraw();
        },
        /**          
         * @method set
         * @param {Object} data
         */
        set: function(data) {
            skritter.timer.reset();
            Prompt.data = data;
            Prompt.dataItem = Prompt.data.getDataItem();
        },
        /**
         * @method showReading
         * @param {Object} event
         */
        showReading: function(event) {
            Prompt.data.show.reading();
            event.preventDefault();
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            skritter.log.console('PROMPT COMPLETE', Prompt.data);
            Prompt.data.save();
            this.trigger('complete');
        },
        /**
         * @method triggerPrevious
         */
        triggerPrevious: function() {
            this.trigger('previous');
        }
    });
    
    return Prompt;
});