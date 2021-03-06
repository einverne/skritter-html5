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
     * @class HomeView
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
            if (skritter.user.isLoggedIn()) {
                this.$el.html(templateIn);
                this.$('#user-avatar').html(skritter.user.getAvatar('img-circle'));
                this.$('.user-name').text(skritter.user.getSetting('name'));
                this.$('#active-lists #table-container').html(skritter.data.vocablists.filterByAttribute({
                    attribute: 'studyingMode',
                    value: ['adding', 'reviewing']
                }).sortByAttribute({
                    attribute: 'studyingMode'
                }).getTable({
                    name: 'Name',
                    studyingMode: 'Status'
                }));
                this.listenTo(skritter.scheduler, 'change:schedule', this.updateDueCount);
                this.listenTo(skritter.sync, 'change:active', this.updateSyncStatus);
                this.updateDueCount();
                this.updateSyncStatus();
            } else {
                this.$el.html(templateOut);
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Home #home-view .home-button': 'handleHomeClicked',
            'click.Home #home-view .login-button': 'handleLoginClicked',
            'click.Home #home-view .logout-button': 'handleLogoutClicked',
            'click.Home #home-view .options-button': 'handleOptionsClicked',
            'click.Home #home-view .study-button': 'handleStudyClicked',
            'click.Home #home-view .sync-button': 'handleSyncClicked',
            'click.Home #home-view .vocab-lists-button': 'handleVocabListsClicked'
        },
        /**
         * @method handleHomeClicked
         * @param {Object} event
         */
        handleHomeClicked: function(event) {
            skritter.router.navigate('/', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleLoginClicked
         * @param {Object} event
         */
        handleLoginClicked: function(event) {
            skritter.modal.show('login');
            event.preventDefault();
        },
        /**
         * @method handleLogoutClicked
         * @param {Object} event
         */
        handleLogoutClicked: function(event) {
            skritter.user.logout();
            event.preventDefault();
        },
        /**
         * @method handleOptionsClicked
         * @param {Object} event
         */
        handleOptionsClicked: function(event) {
            skritter.router.navigate('options', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleVocabListsClicked
         * @param {Object} event
         */
        handleVocabListsClicked: function(event) {
            skritter.router.navigate('vocab/list', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleStudyClicked
         * @param {Object} event
         */
        handleStudyClicked: function(event) {
            skritter.router.navigate('study', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleSyncClicked
         * @param {Object} event
         */
        handleSyncClicked: function(event) {
            skritter.user.sync();
            event.preventDefault();
        },
        updateDueCount: function() {
            Home.this.$('#user-items-due').text(skritter.scheduler.getDueCount());
        },
        updateSyncStatus: function() {
            if (skritter.sync.isSyncing())  {
                Home.this.$('.sync-button').html('Syncing...');
                Home.this.$('.sync-button').addClass('disabled');
            } else {
                Home.this.$('.sync-button').html('Sync');
                Home.this.$('.sync-button').removeClass('disabled');
            }
        }
    });

    return Home;
});