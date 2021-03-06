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
            this.$el.html(templateOptions);
            this.$('input').bootstrapSwitch();
            this.load();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Options #options-view .cancel-button': 'handleCancelClicked',
            'click.Home #options-view .home-button': 'handleHomeClicked',
            'click.Options #options-view .save-button': 'save'
        },
        /**
         * @method handleCancelClicked
         * @param {Object} event
         */
        handleCancelClicked: function(event) {
            skritter.router.navigate('/', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleHomeClicked
         * @param {Object} event
         */
        handleHomeClicked: function(event) {
            skritter.router.navigate('/', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method load
         */
        load: function() {
            //parts
            var activeParts = skritter.user.getActiveParts();
            this.$('#parts-definition').bootstrapSwitch('state', _.contains(activeParts, 'defn'));
            this.$('#parts-reading').bootstrapSwitch('state', _.contains(activeParts, 'rdng'));
            if (skritter.user.getSetting('targetLang') === 'ja') {
                this.$('#parts-tone').closest('.form-group').hide();
            } else {
                this.$('#parts-tone').bootstrapSwitch('state', _.contains(activeParts, 'tone'));
            }
            this.$('#parts-writing').bootstrapSwitch('state', _.contains(activeParts, 'rune'));
            //audio
            this.$('#audio').bootstrapSwitch('state', skritter.user.get('audio'));
            //hide-reading
            this.$('#hide-reading').bootstrapSwitch('state', skritter.user.getSetting('hideReading'));
            //squigs
            this.$('#squigs').bootstrapSwitch('state', skritter.user.getSetting('squigs'));
            //heisig
            this.$('#heisig').bootstrapSwitch('state', skritter.user.getSetting('showHeisig'));
        },
        /**
         * @method save
         * @param {Object} event
         */
        save: function(event) {
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
            event.preventDefault();
        }
    });

    return Options;
});