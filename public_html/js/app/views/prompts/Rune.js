/**
 * @module Skritter
 * @submodule Views
 * @param templateRune
 * @param Canvas
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rune.html',
    'views/prompts/Canvas',
    'views/prompts/Prompt'
], function(templateRune, Canvas, Prompt) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Rune.canvas = new Canvas();
            this.listenTo(Rune.canvas, 'input:up', this.recognize);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.setElement(this.$('#canvas-container'));
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method recognize
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        recognize: function(points, shape) {
            Rune.canvas.drawShape('background', Prompt.review.characters[0].targets[0].shape(Prompt.size));
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            if (settings.orientation() === 'landscape') {
                Prompt.size = settings.height();
                Rune.canvas.resize(Prompt.size).render();
            } else {
                Prompt.size = settings.width();
                Rune.canvas.resize(Prompt.size).render();
            }
            Prompt.prototype.resize.call(this, settings);
        },
        /**
         * @method show
         */
        show: function() {
            Rune.canvas.enableInput();
            this.showWriting(Prompt.review.get('position'));
            this.showReading();
            this.showDefinition();
            this.showSentence();
        }
    });
    
    return Rune;
});