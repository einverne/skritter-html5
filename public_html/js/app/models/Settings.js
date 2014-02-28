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
            $(window).resize(this.triggerResize);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            container: $('#skritter-container'),
            navbar: $('.navbar')
        },
        /**
         * @method height
         * @returns {Number}
         */
        height: function() {
            return this.get('container').height();
        },
        /**
         * @method orientation
         * @returns {String}
         */
        orientation: function() {
            if (this.width() > this.height()) {
                return 'landscape';
            } else {
                return 'portrait';
            }
        },
        triggerResize: function() {
            Settings.this.trigger('resize', Settings.this);
        },
        /**
         * @method width
         * @returns {Number}
         */
        width: function() {
            return this.get('container').width();
        }
    });
    
    return Settings;
});