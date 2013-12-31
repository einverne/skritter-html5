/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class Settings
     */
    var Settings = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Settings.self = this;
            //triggers an event when the window is resized
            $(window).resize(_.bind(this.handleResize, this));
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
            canvasMaxSize: 600,
            canvasSize: 600,
            container: '#skritter-container',
            orientation: null,
            strokeFormat: 'vector',
            transitionSpeed: 200,
            version: '@@version'
        },
        /**
         * @method handleResize
         */
        handleResize: function() {
            //sets the max boundaries of the application
            this.set('appWidth', $('#skritter-container').width());
            this.set('appHeight', $('#skritter-container').height());
            //sets the orientation of the application area
            if (this.get('appWidth') > this.get('appHeight')) {
                this.set('orientation', 'horizontal');
                //sets max dimensions of the canvas element
                var offsetHeight = this.get('appHeight') - 45;
                if (offsetHeight > this.get('canvasMaxSize')) {
                    this.set('canvasSize', this.get('canvasMaxSize'));
                } else {
                    this.set('canvasSize', offsetHeight);
                }
            } else {
                this.set('orientation', 'vertical');
                //sets max dimensions of the canvas element
                if (this.get('appWidth') > this.get('canvasMaxSize')) {
                    this.set('canvasSize', this.get('canvasMaxSize'));
                } else {
                    this.set('canvasSize', this.get('appWidth'));
                }
            }
            this.triggerResize();
        },
        /**
         * @method refreshDate
         * @param {String} callback
         */
        refreshDate: function(callback) {
            skritter.api.getDateInfo(function(date) {
                if (date.today) {
                    Settings.self.set('date', date.today);
                } else {
                    Settings.self.set('date', skritter.moment().format('YYYY[-]MM[-]DD'));
                }
                callback();
            });
        },
        /**
         * @method triggerResize
         */
        triggerResize: function() {
            this.trigger('resize', {width:this.get('appWidth'), height:this.get('appHeight'), canvas:this.get('canvasSize')});
        }
    });
    
    return Settings;
});