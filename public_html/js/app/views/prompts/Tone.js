/**
 * @module Skritter
 * @submodule Views
 * @param templateTone
 * @param Canvas
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-tone.html',
    'views/prompts/Canvas',
    'views/prompts/Prompt'
], function(templateTone, Canvas, Prompt) {
    /**
     * @class PromptTone
     */
    var Tone = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Tone.canvas = new Canvas();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateTone);
            Tone.canvas.setElement(this.$('#canvas-container'));
            Prompt.prototype.render.call(this);
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            if (settings.orientation() === 'landscape') {
                Tone.canvas.size(settings.height()).render();
            } else {
                Tone.canvas.size(settings.width()).render();
            }
            Prompt.prototype.resize.call(this, settings);
        },
        display: function() {
            this.showWriting();
            this.showReading();
            this.showDefinition();
            this.showSentence();
        }
    });
    
    return Tone;
});