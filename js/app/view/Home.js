/**
 * @module Skritter
 * @submodule View
 * @param templateHomeIn
 * @param templateHomeOut
 * @author Joshua McFarland
 */
define([
    'require.text!template/home-in.html',
    'require.text!template/home-out.html',
    'backbone'
], function(templateHomeIn, templateHomeOut) {
    /**
     * @class HomeView
     */
    var Home = Backbone.View.extend({
        initialize: function() {

        },
        /**
         * @method render
         * @return {HomeView}
         */
        render: function() {
            if (Skritter.user.isLoggedIn()) {
                this.$el.html(templateHomeIn);
                this.$('#user-avatar').html(Skritter.user.getAvatar());
                this.$('#user-welcome-message').html(Skritter.user.getSetting('name') + ", you have " + Skritter.data.items.getDueCount() + " items ready for review.");
                this.$('#lang-button').html(Skritter.user.getSetting('targetLang').toUpperCase());
            } else {
                this.$el.html(templateHomeOut);
            }
            this.$('#application-name').text('Skritter');
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home #lang-button': 'switchLanguage'
        },
        /**
         * Toggles the language between Chinese and Japanese, syncs and then
         * reloads the page in the new language.
         * 
         * @method switchLanguage
         */
        switchLanguage: function() {
            if (Skritter.user.isChinese()) {
                Skritter.user.setSetting('targetLang', 'ja');
                Skritter.user.sync(function() {
                    document.location.reload(true);
                }, true);
            } else {
                Skritter.user.setSetting('targetLang', 'zh');
                Skritter.user.sync(function() {
                    document.location.reload(true);
                }, true);
            }
        }
    });


    return Home;
});