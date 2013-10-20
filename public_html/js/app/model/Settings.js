/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class Settings
     */
    var Settings = Backbone.Model.extend({
        initialize: function() {
            this.refreshDate();
            this.resize();
            $(window).resize(_.bind(this.resize, this));
        },
        defaults: {
            apiClientId: 'mcfarljwapiclient',
            apiDomain: 'com',
            apiRoot: 'http://beta.skritter',
            apiClientSecret: 'e3872517fed90a820e441531548b8c',
            apiVersion: 0,
            appHeight: 0,
            appWidth: 0,
            date: null,
            canvasMaxSize: 600,
            canvasSize: 600,
            container: '#skritter-container',
            orientation: 'vertical',
            transitionSpeed: 200,
            version: '0.0.5'
        },
        resize: function() {
            //sets the max boundaries of the application
            this.set('appWidth', $('#skritter-container').width());
            this.set('appHeight', $('#skritter-container').height());
            //sets the orientation of the application area
            if (this.get('appWidth') > this.get('appHeight')) {
                this.set('orientation', 'horizontal');
            } else {
                this.set('orientation', 'vertical');
            }
            //sets max dimensions of the canvas element
            if (this.get('appWidth') > this.get('canvasMaxSize')) {
                this.set('canvasSize', this.get('canvasMaxSize'));
            } else {
                this.set('canvasSize', this.get('appWidth'));
            }
            this.triggerResize();
        },
        refreshDate: function() {
            var date = new Date();
            this.set('date', date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate());
        },
        triggerResize: function() {
            var newSizes = {width:this.get('appWidth'), height:this.get('appHeight'), canvas:this.get('canvasSize')};
            this.trigger('resize', newSizes);
        }
    });
    
    
    return Settings;
});