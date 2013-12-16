/**
 * @module Skritter
 * @submodule Views
 * @param templateFooter
 * @param templateLoggedIn
 * @param templateLoggedOut
 * @author Joshua McFarland
 */
define([
    'require.text!templates/home-footer.html',
    'require.text!templates/home-logged-in.html',
    'require.text!templates/home-logged-out.html',
    'backbone'
], function(templateFooter, templateLoggedIn, templateLoggedOut) {
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
                this.$el.html(templateLoggedIn);
                this.$('#user-avatar').html(skritter.user.getAvatar('img-circle'));
                this.$('.user-name').text(skritter.user.getSetting('name'));
                this.$('#user-items-due').text(skritter.scheduler.getDueCount());
                if (skritter.data.reviews.length > 0)
                    this.$('#user-unsynced-reviews').text('(' + skritter.data.reviews.length + ')');
            } else {
                this.$el.html(templateLoggedOut);
            }
            this.$el.append(templateFooter);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home .link-button': 'handleLinkClicked',
            'click.Home #home-view .login-button': 'handleLogin',
            'click.Home #home-view .logout-button': 'handleLogout',
            'click.Home #home-view .sync-button': 'handleSync'
        },
        handleLogin: function() {
            skritter.modal.show('login');
            return false;
        },
        handleLogout: function() {
            skritter.user.logout();
            return false;
        },
        /**
         * Overrides the default href linking and replaces it with a more backbone suitable solutions. It
         * currently 
         * 
         * @method handleLinkClicked
         * @param {Object} event
         * @returns {Boolean}
         */
        handleLinkClicked: function(event) {
            var fragment = this.$(event.currentTarget).data('fragment');
            var options = (this.$(event.target).data('replace')) ? {trigger: true, replace: true} : {trigger: true};
            switch (fragment) {
                case '#back':
                    skritter.router.back();
                    break;
                default:
                    skritter.router.navigate(fragment, options);
                    break;
            }
            return false;
        },
        /**
         * @method handleSync
         */
        handleSync: function() {
            var self = this;
            skritter.modal.show('progress').setTitle('Syncing').setProgress('100');
            skritter.user.sync(function() {
                skritter.modal.hide();
                self.render();
            });
        }
    });
    
    return Home;
});