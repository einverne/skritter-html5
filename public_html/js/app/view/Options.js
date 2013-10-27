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
            'click.Options #save-button': 'save'
        },
        /**
         * Loads and sets all of the user settings on the interface of the view.
         * 
         * @method load
         */
        load: function() {
            var parts = Skritter.user.getStudyParts();
	    this.$('#part-rune').prop('checked', _.contains(parts, 'rune'));
	    this.$('#part-tone').prop('checked', _.contains(parts, 'tone'));
	    this.$('#part-defn').prop('checked', _.contains(parts, 'defn'));
	    this.$('#part-rdng').prop('checked', _.contains(parts, 'rdng'));
	    this.$('#raw-squigs').prop('checked', Skritter.user.getSetting('squigs'));
            this.$('#animation-speed').attr('value', Skritter.user.getSetting('animationSpeed')*100);
	    this.$('#order-strictness').attr('value', Skritter.user.getSetting('orderWeight')*100);
        },
        /**
         * Saves all the settings to the database.
         * 
         * @method save
         */
        save: function() {
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
            Skritter.user.setSetting(lang, parts);
            Skritter.user.setSetting('animationSpeed', this.$('#animation-speed').val()/100);
            Skritter.user.setSetting('orderWeight', this.$('#order-strictness').val()/100);
            Skritter.user.setSetting('squigs', this.$('#raw-squigs').prop('checked'));
            Skritter.user.cache();
        }
    });
    
    
    return Options;
});