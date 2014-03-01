/**
 * @module Skritter
 * @submodule Views
 * @param templateDefn
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-defn.html',
    'views/prompts/Prompt'
], function(templateDefn, Prompt) {
    /**
     * @class PromptDefn
     */
    var Defn = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            Prompt.prototype.render.call(this);
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            if (settings.orientation() === 'landscape') {
                this.$('#input-container').height(settings.height());
                this.$('#input-container').width(settings.height());
            } else {
                this.$('#input-container').height(settings.width());
                this.$('#input-container').width(settings.width());
            }
            Prompt.prototype.resize.call(this, settings);
        },
        display: function() {
            this.show.writing();
            this.show.reading(1, true);
            this.show.definition();
            this.show.sentence();
        }
    });
    
    return Defn;
});