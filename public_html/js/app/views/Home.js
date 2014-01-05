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
            this.listenTo(skritter.sync, 'complete', this.updateDueCount);
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
                this.loadActiveLists();
                this.updateDueCount();
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
            'click.Home #home-view #active-lists tbody tr': 'toggleList',
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
            if (!skritter.sync.isSyncing()) {
                skritter.modal.show('progress').setTitle('Syncing').setProgress('100');
                skritter.user.sync(function() {
                    skritter.modal.hide();
                    self.render();
                });
            }                
        },
        /**
         * @method loadActiveLists
         * @param {Function} callback
         */
        loadActiveLists: function(callback) {
            var self = this;
            skritter.api.getVocabLists('studying', 'id,name,studyingMode', function(lists) {
                var div = '';
                self.$('#active-lists #lists-message').hide();
                self.$('#active-lists .loader').show();
                self.$('#active-lists tbody').html(div);
                if (lists.status === 404) {
                    self.$('#active-lists #lists-message').show().text("Unable to load lists due to being offline.");
                } else if (lists.length > 0) {
                    var activeCount = 0;
                    for (var i in lists) {
                        var list = lists[i];
                        if (list.studyingMode && (list.studyingMode === 'adding' || list.studyingMode === 'reviewing')) {
                            div += "<tr id='list-" + list.id + "' class='cursor'>";
                            div += "<td>" + list.name + "</td>";
                            if (list.studyingMode === 'adding') {
                                div += "<td>Adding</td>";
                            } else {
                                div += "<td>Paused</td>";
                            }
                            div += "</tr>";
                            activeCount++;
                        }
                    }
                    if (activeCount === 0)
                        self.$('#active-lists #lists-message').show().text("All of your lists have been added into your studies.");
                } else {
                    self.$('#active-lists #lists-message').show().text("You haven't added any lists yet!");
                }
                self.$('#active-lists tbody').html(div);
                self.$('#active-lists .loader').hide();
                if (typeof callback === 'function')
                    callback(lists);
            });
        },
        /**
         * @method 
         * @param {type} event
         * @returns {undefined}
         */
        toggleList: function(event) {
            var self = this;
            var listId = event.currentTarget.id.replace('list-', '');
            var status = (event.currentTarget.children[1].innerText === 'Adding') ? 'reviewing' : 'adding';
            self.$('#active-lists .loader').show();
            self.$('#active-lists tbody').html('');
            skritter.api.updateVocabList({
                id: listId,
                studyingMode: status
            }, function() {
                self.loadActiveLists();
            });
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#user-items-due').text(skritter.scheduler.sort().getDueCount());
            if (skritter.data.reviews.length > 0) {
                this.$('#user-unsynced-reviews').text('(' + skritter.data.reviews.length + ')');
            } else {
                this.$('#user-unsynced-reviews').text('');
            }
        }
    });

    return Home;
});