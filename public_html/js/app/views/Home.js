/**
 * @module Skritter
 * @submodule Views
 * @param templateIn
 * @param templateOut
 * @author Joshua McFarland
 */
define([
    'require.text!templates/home-logged-in.html',
    'require.text!templates/home-logged-out.html'
], function(templateIn, templateOut) {
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
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateIn);
                this.$('#user-avatar').html(skritter.user.getAvatar('img-circle'));
                this.$('.user-name').text(skritter.user.getSetting('name'));
                this.$('#user-items-due').text(skritter.scheduler.getDueCount());
            } else {
                this.$el.html(templateOut);
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home #home-view .login-button': 'handleLoginClicked',
            'click.Home #home-view .logout-button': 'handleLogoutClicked',
            'click.Home #home-view .options-button': 'handleOptionsClicked'
        },
        handleLoginClicked: function(event) {
            skritter.modal.show('login');
            event.preventDefault();
        },
        handleLogoutClicked: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        handleOptionsClicked: function(event) {
            skritter.router.navigate('options', {trigger: true});
            event.preventDefault();
        }
    });

    return Home;
});