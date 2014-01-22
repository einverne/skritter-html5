/**
 * @module Skritter
 * @param templateOptions
 * @author Joshua McFarland
 */
define([
    'require.text!templates/options.html'
], function(templateOptions) {
    /**
     * @class Options
     */
    var Options = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Options.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateOptions);
            this.$('input').bootstrapSwitch();
            this.load();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Options #options-view #save-button': 'save'
        },
        /**
         * @method load
         */
        load: function() {
            var activeParts = skritter.user.getActiveParts();
            this.$('#parts-definition').bootstrapSwitch('setState', _.contains(activeParts, 'defn'));
            this.$('#parts-reading').bootstrapSwitch('setState', _.contains(activeParts, 'rdng'));
            this.$('#parts-tone').bootstrapSwitch('setState', _.contains(activeParts, 'tone'));
            this.$('#parts-writing').bootstrapSwitch('setState', _.contains(activeParts, 'rune'));
        },
        /**
         * @method save
         * @param {Object} event
         */
        save: function(event) {
            event.preventDefault();
            var activeParts = [];
            if (this.$('#parts-definition').bootstrapSwitch('state'))
                activeParts.push('defn');
            if (this.$('#parts-reading').bootstrapSwitch('state'))
                activeParts.push('rdng');
            if (this.$('#parts-tone').bootstrapSwitch('state'))
                activeParts.push('tone');
            if (this.$('#parts-writing').bootstrapSwitch('state'))
                activeParts.push('rune');
            if (activeParts.length === 0) {
                skritter.modal.show('confirm').noHeader().setBody('You need to select at least one part to study!');
                return false;
            } else {
                skritter.user.setActiveParts(activeParts);
            }
            //ISSUE #117: scheduler needs to be reloaded on options save
            skritter.scheduler.loadAll(function() {
                if (skritter.view.study)
                    skritter.view.study.clearPrompt();
                skritter.router.navigate('/', {trigger: true, replace: true});
            });
        }
    });
    
    return Options;
});