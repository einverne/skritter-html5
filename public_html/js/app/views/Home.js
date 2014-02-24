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
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html('');
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateLoggedIn);
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
            'click.Home #home-view .logout-button': 'handleLogoutButtonClicked'
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
        }
    });
    
    return Home;
});