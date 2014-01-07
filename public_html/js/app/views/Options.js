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
            //this.toggleLanguage();
            
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
            
           //hide reading
            if (skritter.user.getSetting('hideReading')) {
                this.$('#hide-reading #on').addClass('active');
            } else {
                this.$('#hide-reading #off').addClass('active');
            } 
            
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
            
            //heisig
            if (skritter.user.getSetting('showHeisig')) {
                this.$('#heisig-keywords #on').addClass('active');
            } else {
                this.$('#heisig-keywords #off').addClass('active');
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
                skritter.modal.show('confirm').noHeader().setBody('You need to select at least one part to study!');
                return false;
            } else {
                if (skritter.user.isChinese()) {
                    skritter.user.set('filterChineseParts', parts);
                } else {
                    skritter.user.set('filterJapaneseParts', parts);
                }
            }
            
            //hide reading
            if (this.$('#hide-reading #on').hasClass('active')) {
                skritter.user.setSetting('hideReading', true);
            } else {
                skritter.user.setSetting('hideReading', false);
            }
            
            //audio
            if (this.$('#audio #on').hasClass('active')) {
                skritter.user.set('audio', true);
            } else {
                skritter.user.set('audio', false);
            }
            
            //squigs
            if (this.$('#raw-squigs #on').hasClass('active')) {
                skritter.user.setSetting('squigs', true);
            } else {
                skritter.user.setSetting('squigs', false);
            }
            
            //squigs
            if (this.$('#heisig-keywords #on').hasClass('active')) {
                skritter.user.setSetting('showHeisig', true);
            } else {
                skritter.user.setSetting('showHeisig', false);
            }
            
            skritter.user.cache();
            skritter.user.save();
            //ISSUE #117: scheduler needs to be reloaded on options save
            skritter.scheduler.loadFromDatabase(function() {
                //clears the current study prompt to force part changes
                if (skritter.view.study)
                    skritter.view.study.clearPrompt();
                skritter.router.navigate('/', {trigger: true, replace: true});
            });
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