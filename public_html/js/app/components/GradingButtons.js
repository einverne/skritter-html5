/**
 * @module Skritter
 * @submodule Components
 * @param templateGradingButtons
 * @author Joshua McFarland
 */
define([
    'require.text!templates/grading-buttons.html',
    'backbone'
], function(templateGradingButtons) {
    /**
     * @class GradingButtons
     */
    var GradingButtons = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            GradingButtons.animationSpeed = 100;
            GradingButtons.expanded = true;
            GradingButtons.value = 3;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateGradingButtons);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.GradingButtons #grade1': 'handleButtonClick',
            'click.GradingButtons #grade2': 'handleButtonClick',
            'click.GradingButtons #grade3': 'handleButtonClick',
            'click.GradingButtons #grade4': 'handleButtonClick'
        },
        /**
         * @method collapse
         */
        collapse: function() {
            GradingButtons.expanded = false;
            for (var i = 1; i <= 4; i++) {
                if (this.$('#grade' + i).hasClass('selected')) {
                    this.$('#grade' + i).show(GradingButtons.animationSpeed);
                } else {
                    this.$('#grade' + i).hide(GradingButtons.animationSpeed);
                }
            }
        },
        /**
         * @method expand
         */
        expand: function() {
            GradingButtons.expanded = true;
            this.$('#grading-buttons').children().show(GradingButtons.animationSpeed);
        },
        /**
         * @method grade
         * @param {Number} value
         * @returns {Number}
         */
        grade: function(value) {
            if (value)
                GradingButtons.value = value;
            return GradingButtons.value;
        },
        /**
         * @method handleButtonClick
         * @param {Object} event
         */
        handleButtonClick: function(event) {
            console.log(GradingButtons.expanded);
            this.select(parseInt(event.currentTarget.id.replace(/[^\d]+/, ''), 10));
            if (GradingButtons.expanded) {
                this.triggerSelected();
            } else {
                this.toggle();
            }
        },
        /**
         * @method hide
         */
        hide: function() {
            this.$('#grading-buttons').hide(GradingButtons.animationSpeed);
            return this;
        },
        /**
         * @method remove
         */
        remove: function() {
            this.$('#grading-buttons').remove();
            return this;
        },
        /**
         * @method select
         * @param {Number} value
         */
        select: function(value) {
            if (value)
                GradingButtons.value = value;
            for (var i = 1; i <= 4; i++) {
                if (GradingButtons.value === i) {
                    this.$('#grade' + i).addClass('selected');
                } else {
                    this.$('#grade' + i).removeClass('selected');
                }
            }
            this.show();
            return this;
        },
        /**
         * @method show
         */
        show: function() {
            this.$('#grading-buttons').show(GradingButtons.animationSpeed);
            return this;
        },
        /**
         * @method toggle
         */
        toggle: function() {
            if (GradingButtons.expanded) {
                this.collapse();
            } else {
                this.expand();
            }
            return this;
        },
        /**
         * @method triggerSelected
         */
        triggerSelected: function() {
            this.trigger('selected', GradingButtons.value);
        }
    });

    return GradingButtons;
});