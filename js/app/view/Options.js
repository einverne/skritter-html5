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
         * @method initialize
         */
        initialize: function() {
            Options.originalLang = Skritter.user.getSetting('targetLang');
        },
        /**
         * @method render
         */
        render: function() {
            if (!Skritter.user.isLoggedIn())
            document.location.hash = '';
            this.$el.html(templateOptions);        
            this.load();
            //ISSUE #31: hides the tone option for users studying japanese
            if (Skritter.user.getSetting('targetLang') === 'ja')
                this.$('#part-tone').closest('.checkbox').hide();
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
            'click.Options #language-options': 'selectLanguage',
            'click.Options #raw-squigs': 'toggleRawSquigs'
        },
        /**
         * Loads and sets all of the user settings on the interface of the view.
         * 
         * @method load
         */
        load: function() {
            //language style
            switch (Skritter.user.getStyle()) {
                case 'ja':
                    this.$('#language-style').text('Japanese');
                    this.$('#language-options .divider').hide();
                    this.$('#style-ja').hide();
                    break;
                case 'zh-both':
                    this.$('#language-style').text('Chinese (Both)');
                    this.$('#language-options .divider').show();
                    this.$('#style-zh-both').hide();
                    break;
                case 'zh-simp':
                    this.$('#language-style').text('Chinese (Simplified)');
                    this.$('#language-options .divider').show();
                    this.$('#style-zh-simp').hide();
                    break;
                case 'zh-trad':
                    this.$('#language-style').text('Chinese (Traditional)');
                    this.$('#language-options .divider').show();
                    this.$('#style-zh-trad').hide();
                    break;
            }
            //language parts
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
         * Saves all the settings to localStorage.
         * 
         * @method save
         * @param {Object} event
         */
        save: function(event) {
            //language parts
            var parts = [];
            if (this.$('#part-defn').prop('checked')) parts.push('defn');
            if (this.$('#part-rdng').prop('checked')) parts.push('rdng');
            if (this.$('#part-rune').prop('checked')) parts.push('rune');
            if (this.$('#part-tone').prop('checked')) parts.push('tone');
            if (parts.length === 0) {
                this.$('.error-message').html(Skritter.fn.twbsAlertHTML('warning', 'At least one part must be selected for study.'));
                return false;
            }
            var lang = Skritter.user.get('settings').targetLang;
            if (lang === 'zh') {
                lang = 'chineseStudyParts';
            } else {
                lang = 'japaneseStudyParts';
            }
            Skritter.user.setSetting(lang, parts);

            //language style
            var style = this.$('#language-style').text();
            switch(style) {
                case 'Japanese':
                    Skritter.user.setSetting('targetLang', 'ja');
                    break;
                case 'Chinese (Both)':
                    Skritter.user.setSetting('targetLang', 'zh');
                    Skritter.user.setSetting('addSimplified', true);
                    Skritter.user.setSetting('addTraditional', true);
                    break;
                case 'Chinese (Simplified)':
                    Skritter.user.setSetting('targetLang', 'zh');
                    Skritter.user.setSetting('addSimplified', true);
                    Skritter.user.setSetting('addTraditional', false);
                    break;
                case 'Chinese (Traditional)':
                    Skritter.user.setSetting('targetLang', 'zh');
                    Skritter.user.setSetting('addSimplified', false);
                    Skritter.user.setSetting('addTraditional', true);
                    break;
            }

            //audio
            if (this.$('#audio .active')[0].id === 'audio-on') {
                Skritter.user.set('audio', true);
            } else {
                Skritter.user.set('audio', false);
            }
            
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
            //only reload into a new language if it has changed
            if (Options.originalLang !== Skritter.user.getSetting('targetLang')) {
                Skritter.user.sync(function() {
                    document.location.reload(true);
                }, true);
            }
        },
        /**
         * @method selectLanguage
         * @param {Object} event
         */
        selectLanguage: function(event) {
            var selected = event.target.id;
            this.$('#language-options').children().children('a').show();
            switch (selected) {
                case 'style-ja':
                    this.$('#language-style').text('Japanese');
                    this.$('#language-options .divider').hide();
                    this.$('#style-ja').hide();
                    break;
                case 'style-zh-both':
                    this.$('#language-style').text('Chinese (Both)');
                    this.$('#language-options .divider').show();
                    this.$('#style-zh-both').hide();
                    break;
                case 'style-zh-simp':
                    this.$('#language-style').text('Chinese (Simplified)');
                    this.$('#language-options .divider').show();
                    this.$('#style-zh-simp').hide();
                    break;
                case 'style-zh-trad':
                    this.$('#language-style').text('Chinese (Traditional)');
                    this.$('#language-options .divider').show();
                    this.$('#style-zh-trad').hide();
                    break;
            }
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
