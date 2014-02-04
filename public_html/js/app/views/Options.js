/**
 * @module Skritter
 * @param templateOptions
 * @author Joshua McFarland
 */
define([
    'require.text!templates/options.html'
], function(templateOptions) {
    /**
     * @class OptionsView
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
            var activeParts = skritter.user.getActiveParts();
            var options = {
                parts: {
                    definition: _.contains(activeParts, 'defn'),
                    reading: _.contains(activeParts, 'rdng'),
                    tone: _.contains(activeParts, 'tone'),
                    writing: _.contains(activeParts, 'rune')
                },
                audio: skritter.user.get('audio'),
                hideReading: skritter.user.getSetting('hideReading'),
                squigs: skritter.user.getSetting('squigs'),
                heisig: skritter.user.getSetting('showHeisig')
            };
            this.$el.html(_.template(templateOptions, options));
            this.$('input').bootstrapSwitch();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Options #options-view #save-button': 'save'
        },
        /**
         * @method save
         * @param {Object} event
         */
        save: function(event) {
            event.preventDefault();
            //parts
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
            //audio
            skritter.user.set('audio', this.$('#audio').bootstrapSwitch('state'));
            //hide-reading
            skritter.user.setSetting('hideReading', this.$('#hide-reading').bootstrapSwitch('state'));
            //squigs
            skritter.user.setSetting('squigs', this.$('#squigs').bootstrapSwitch('state'));
            //heisig
            skritter.user.setSetting('showHeisig', this.$('#heisig').bootstrapSwitch('state'));
            //cache all of the user settings into localStorage
            skritter.user.cache();
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