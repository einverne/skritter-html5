/**
 * @module Skritter
 * @submodule Views
 * @param templateLoggedIn
 * @param templateLoggedOut
 * @author Joshua McFarland
 */
define([
    'require.text!templates/home-logged-in.html',
    'require.text!templates/home-logged-out.html'
], function(templateLoggedIn, templateLoggedOut) {
    /**
     * @class Home
     */
    var Home = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Home.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html('');
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateLoggedIn);
                this.$('#user-avatar').html(skritter.user.settings.avatar('img-circle'));
                this.$('#user-items-due').html(skritter.user.scheduler.dueCount());
                this.$('#user-name').html(skritter.user.settings.get('name'));
            } else {
                this.$el.html(templateLoggedOut);
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home #home-view .login-button': 'handleLoginButtonClicked',
            'click.Home #home-view .logout-button': 'handleLogoutButtonClicked',
            'click.Home #home-view .study-button': 'handleStudyButtonClicked',
            'click.Home #home-view .vocablists-button': 'handleVocabListsButtonClicked'
        },
        /**
         * @method handleLoginButtonClicked
         * @param {Object} event
         */
        handleLoginButtonClicked: function(event) {
            skritter.modals.show('login');
            event.preventDefault();
        },
        /**
         * @method handleLogoutButtonClicked
         * @param {Object} event
         */
        handleLogoutButtonClicked: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        /**
         * @method handleStudyButtonClicked
         * @param {Object} event
         */
        handleStudyButtonClicked: function(event) {
            skritter.router.navigate('study', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleStudyButtonClicked
         * @param {Object} event
         */
        handleVocabListsButtonClicked: function(event) {
            skritter.router.navigate('vocab/list', {trigger: true});
            event.preventDefault();
        }
    });
    
    return Home;
});