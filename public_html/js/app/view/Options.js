/**
 * @module Skritter
 * @param templateOptions
 * @author Joshua McFarland
 */
define([
    'require.text!template/options.html',
    'backbone'
], function(templateOptions) {
    /**
     * @class OptionsView
     */
    var Options = Backbone.View.extend({
        /**
         * @method render
         */
        render: function() {
            if (!Skritter.user.isLoggedIn())
		document.location.hash = '';
            this.$el.html(templateOptions);            
            this.load();
            return this;
        },
        /**
         * Immediately saves a users selection after they have been toggled.
         * 
         * @property {Object} save
         */
        events: {
            'click.Options #save-button': 'save',
            'click.Options #audio': 'toggleAudio',
            'click.Options #raw-squigs': 'toggleRawSquigs'
        },
        /**
         * Loads and sets all of the user settings on the interface of the view.
         * 
         * @method load
         */
        load: function() {
            //parts
            var parts = Skritter.user.getStudyParts();
	    this.$('#part-rune').prop('checked', _.contains(parts, 'rune'));
	    this.$('#part-tone').prop('checked', _.contains(parts, 'tone'));
	    this.$('#part-defn').prop('checked', _.contains(parts, 'defn'));
	    this.$('#part-rdng').prop('checked', _.contains(parts, 'rdng'));
            //audio
            if (Skritter.user.get('audio')) {
                this.toggleAudio(null, true);
            } else {
                this.toggleAudio(null, false);
            }
            //raw squigs
            if (Skritter.user.getSetting('squigs')) {
                this.toggleRawSquigs(null, true);
            } else {
                this.toggleRawSquigs(null, false);
            }
            //animation speed
            this.$('#animation-speed').attr('value', Skritter.user.getSetting('animationSpeed')*100);
            //order strictness
	    this.$('#order-strictness').attr('value', Skritter.user.getSetting('orderWeight')*100);
        },
        /**
         * Saves all the settings to the database.
         * 
         * @method save
         */
        save: function() {
            //language parts
            var lang = Skritter.user.get('settings').targetLang;
            if (lang === 'zh') {
		lang = 'chineseStudyParts';
	    } else {
		lang = 'japaneseStudyParts';
	    }
	    var parts = [];
	    if (this.$('#part-defn').prop('checked')) parts.push('defn');
	    if (this.$('#part-rdng').prop('checked')) parts.push('rdng');
	    if (this.$('#part-rune').prop('checked')) parts.push('rune');
	    if (this.$('#part-tone').prop('checked')) parts.push('tone');
            if (this.$('#audio .active')[0].id === 'audio-on') {
                Skritter.user.set('audio', true);
            } else {
                Skritter.user.set('audio', false);
            }
            Skritter.user.setSetting(lang, parts);
            //animation speed
            Skritter.user.setSetting('animationSpeed', this.$('#animation-speed').val()/100);
            //order strictness
            Skritter.user.setSetting('orderWeight', this.$('#order-strictness').val()/100);
            //raw squigs
            if (this.$('#raw-squigs .active')[0].id === 'raw-squigs-on') {
                Skritter.user.setSetting('squigs', true);
            } else {
                Skritter.user.setSetting('squigs', false);
            }
            Skritter.user.cache();
        },
        /**
         * @method toggleAudio
         * @param {Object} event
         * @param {Boolean} value
         */
        toggleAudio: function(event, value) {
            var id = (event) ? (event.target.id) : false;
            if (id === 'audio-on' || value) {
                this.$('#audio-on').addClass('active');
                this.$('#audio-off').removeClass('active');
            } else {
                this.$('#audio-off').addClass('active');
                this.$('#audio-on').removeClass('active');
            }
        },
        /**
         * @method toggleRawSquigs
         * @param {Object} event
         * @param {Boolean} value
         */
        toggleRawSquigs: function(event, value) {
            var id = (event) ? (event.target.id) : false;
            if (id === 'raw-squigs-on' || value) {
                this.$('#raw-squigs-on').addClass('active');
                this.$('#raw-squigs-off').removeClass('active');
            } else {
                this.$('#raw-squigs-off').addClass('active');
                this.$('#raw-squigs-on').removeClass('active');
            }
        }
    });
    
    
    return Options;
});