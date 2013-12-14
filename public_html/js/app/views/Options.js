/**
 * @module Skritter
 * @submodule Views
 * @param templateOptions
 * @author Joshua McFarland
 */
define([
    'require.text!templates/options.html',
    'backbone'
], function(templateOptions) {
    var Options = Backbone.View.extend({
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(templateOptions);
            this.load();
            //ISSUE #31: hides the tone option for users studying japanese
            if (skritter.user.isJapanese())
                this.$('#parts #tone').hide();
            return this;
        },
        events: {
            'click.Options #options-view #cancel-button': 'navigateBack',
            'click.Options #options-view #save-button': 'save',
            'click.Options #options-view #language li': 'toggleLanguage'
        },
        load: function() {
            //language
            this.toggleLanguage();
            
            //parts
            var activeParts = skritter.user.getActiveStudyParts();
            if (_.contains(activeParts, 'rune'))
                this.$('#parts #rune').addClass('active');
            if (_.contains(activeParts, 'tone'))
                this.$('#parts #tone').addClass('active');
            if (_.contains(activeParts, 'defn'))
                this.$('#parts #defn').addClass('active');
            if (_.contains(activeParts, 'rdng'))
                this.$('#parts #rdng').addClass('active');
            
            //audio
            if (skritter.user.get('audio')) {
                this.$('#audio #on').addClass('active');
            } else {
                this.$('#audio #off').addClass('active');
            }
            
            //squigs
            if (skritter.user.getSetting('squigs')) {
                this.$('#raw-squigs #on').addClass('active');
            } else {
                this.$('#raw-squigs #off').addClass('active');
            }
        },
        navigateBack: function() {
            skritter.router.navigate('', {trigger: true});
            return false;
        },
        save: function() {
            //language
            var style = this.$('#language #current').text();
            switch(style) {
                case 'Japanese':
                    skritter.user.setSetting('targetLang', 'ja');
                    break;
                case 'Chinese (Both)':
                    skritter.user.setSetting('targetLang', 'zh');
                    skritter.user.setSetting('addSimplified', true);
                    skritter.user.setSetting('addTraditional', true);
                    break;
                case 'Chinese (Simplified)':
                    skritter.user.setSetting('targetLang', 'zh');
                    skritter.user.setSetting('addSimplified', true);
                    skritter.user.setSetting('addTraditional', false);
                    break;
                case 'Chinese (Traditional)':
                    skritter.user.setSetting('targetLang', 'zh');
                    skritter.user.setSetting('addSimplified', false);
                    skritter.user.setSetting('addTraditional', true);
                    break;
            }
            
            //parts
            var parts = [];
            if (this.$('#parts #rune').hasClass('active'))
                parts.push('rune');
            if (this.$('#parts #tone').hasClass('active'))
                parts.push('tone');
            if (this.$('#parts #defn').hasClass('active'))
                parts.push('defn');
            if (this.$('#parts #rdng').hasClass('active'))
                parts.push('rdng');
            if (parts.length === 0) {
                //TODO: handle error message with a modal
                return false;
            } else {
                if (skritter.user.isChinese()) {
                    skritter.user.setSetting('chineseStudyParts', parts);
                } else {
                    skritter.user.setSetting('japaneseStudyParts', parts);
                }
            }
            
            //audio
            if (this.$('#audio #on').hasClass('active')) {
                skritter.user.set('audio', true);
            } else {
                skritter.user.set('audio', false);
            }
            
            //audio
            if (this.$('#raw-squigs #on').hasClass('active')) {
                skritter.user.setSetting('squigs', true);
            } else {
                skritter.user.setSetting('squigs', false);
            }
            
            skritter.user.cache();
            skritter.router.navigate('/', {trigger: true, replace: true});
        },
        toggleLanguage: function(event) {
            if (event)
                event.preventDefault();
            var style = (event) ? event.currentTarget.id : skritter.user.getStyle();
            this.$('#language').children().children('li').show();
            switch (style) {
                case 'ja':
                    this.$('#language #current').text('Japanese');
                    this.$('#language #ja').hide();
                    this.$('#language .divider').hide();
                    break;
                case 'zh-simp':
                    this.$('#language #current').text('Chinese (Simplified)');
                    this.$('#language #zh-simp').hide();
                    this.$('#language .divider').show();
                    break;
                case 'zh-trad':
                    this.$('#language #current').text('Chinese (Traditional)');
                    this.$('#language #zh-trad').hide();
                    this.$('#language .divider').show();
                    break;
                case 'zh-both':
                    this.$('#language #current').text('Chinese (Both)');
                    this.$('#language #zh-both').hide();
                    this.$('#language .divider').show();
                    break;
            }
        }
    });
    
    return Options;
});