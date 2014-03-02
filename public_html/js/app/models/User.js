/**
 * @module Skritter
 * @submodule Models
 * @param Data
 * @param Scheduler
 * @param Settings
 * @param Sync
 * @author Joshua McFarland
 */
define([
    'models/user/Data',
    'models/user/Scheduler',
    'models/user/Settings',
    'models/user/Sync'
], function(Data, Scheduler, Settings, Sync) {
    /**
     * @method User
     */
    var User = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //loads generic models regardless of user status
            this.data = new Data();
            this.settings = new Settings();
            //loads models for authenticated active user
            if (localStorage.getItem('active')) {
                var userId = localStorage.getItem('active');
                this.scheduler = new Scheduler();
                this.sync = new Sync(JSON.parse(localStorage.getItem(userId + '-sync')));
                this.set(JSON.parse(localStorage.getItem(userId)));
                this.settings.set(JSON.parse(localStorage.getItem(userId + '-settings')));
                skritter.api.set('token', this.get('access_token'));
            }
            //sets the id to the user_id for easier usage
            this.set('id', this.get('user_id'));
            //stores user to localStorage when they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            access_token: null,
            expires_in: null,
            refresh_token: null,
            token_type: null,
            user_id: 'guest'
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            skritter.api.set('token', event.get('access_token'));
            var user = event.toJSON();
            delete user.settings;
            delete user.statusCode;
            localStorage.setItem(this.get('user_id'), JSON.stringify(user));
        },
        /**
         * Returns true if the user has been authenticated and is logged in.
         * 
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            if (this.get('access_token'))
                return true;
            return false;
        },
        /**
         * Performs a login that updates all of the nessesary models and then
         * callbacks back when the operation has finished.
         * 
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        login: function(username, password, callback) {
            var self = this;
            skritter.api.authenticateUser(username, password, function(result) {
                if (result.statusCode === 200) {
                    self.set(result);
                    self.settings.set('id', result.user_id);
                    self.settings.fetch(function() {
                        localStorage.setItem('active', result.user_id);
                        callback(result);
                    });
                } else {
                    callback(result);
                }
            });
        },
        /**
         * Logs the user out while perserving settings and then forces the page to reload;
         * 
         * @method logout
         */
        logout: function() {
            var self = this;
            skritter.modals.show()
                    .set('.modal-header', false)
                    .set('.modal-body', 'LOGGING OUT', 'text-center')
                    .set('.modal-footer', false);
            skritter.storage.deleteDatabase(function() {
                localStorage.removeItem('active');
                localStorage.removeItem(self.id);
                localStorage.removeItem(self.id + '-sync');
                document.location.reload(true);
            });
        }
    });

    return User;
});