/**
 * @module Skritter
 * @submodule Model
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
            //triggers an event when the window is resized
            $(window).resize(this.handleResize);
            //forces the window to resize onload
            this.handleResize();
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            appHeight: 0,
            appWidth: 0,
            date: null,
            canvasMaxSize: 1600,
            canvasSize: 600,
            container: '#skritter-container',
            orientation: null,
            strokeFormat: 'vector',
            transitionSpeed: 200,
            version: '@@version'
        },
        /**
         * Checks the version against a non-cached version json file that isn't included in
         * the appcache. The intended use is to warn people whose browsers are hard caching
         * the application when a new version is available.
         * 
         * @method checkVersion
         * @param {Function} callback
         */
        checkVersion: function(callback) {
            var promise = $.getJSON('version.json');
            var currentVersion = this.get('version');
            promise.done(function(data) {
                if (currentVersion === data.version) {
                    callback(true, data);
                } else {
                    callback(false, currentVersion, data.version);
                }
            });
            promise.fail(function() {
                callback(true);
            });
        },
        /**
         * @method handleResize
         */
        handleResize: function() {
            //sets the max boundaries of the application
            Settings.this.set('appWidth', $(window).width());
            Settings.this.set('appHeight', $(window).height());
            //sets the orientation of the application area
            if (Settings.this.get('appWidth') > Settings.this.get('appHeight')) {
                Settings.this.set('orientation', 'landscape');
                //sets max dimensions of the canvas element
                if (Settings.this.get('appHeight') - 50 > Settings.this.get('canvasMaxSize')) {
                    Settings.this.set('canvasSize', Settings.this.get('canvasMaxSize'));
                } else {
                    Settings.this.set('canvasSize', Settings.this.get('appHeight') - 50);
                }
            } else {
                Settings.this.set('orientation', 'portrait');
                //sets max dimensions of the canvas element
                if (Settings.this.get('appWidth') > Settings.this.get('canvasMaxSize')) {
                    Settings.this.set('canvasSize', Settings.this.get('canvasMaxSize'));
                } else {
                    Settings.this.set('canvasSize', Settings.this.get('appWidth'));
                }
            }
            Settings.this.triggerResize();
        },
        /**
         * @method refreshDate
         * @param {String} callback
         */
        refreshDate: function(callback) {
            skritter.api.getDateInfo(function(date) {
                if (date.today) {
                    Settings.this.set('date', date.today);
                } else {
                    Settings.this.set('date', skritter.moment().format('YYYY[-]MM[-]DD'));
                }
                callback();
            });
        },
        /**
         * @method triggerResize
         */
        triggerResize: function() {
            Settings.this.trigger('resize', {
                width: Settings.this.get('appWidth'),
                height: Settings.this.get('appHeight'),
                canvas: Settings.this.get('canvasSize'),
                navbar: 45
            });
        }
    });

    return Settings;
});