/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Settings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Settings.this = this;
            //stores user settings to localStorage as they are changed
            this.on('change', this.cache);
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(event.id + '-settings', JSON.stringify(event.toJSON()));
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            skritter.api.getUser(this.get('id'), function(result) {
                Settings.this.set(result);
                callback();
            });
        }
    });
    
    return Settings;
});