/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    
    var Settings = Backbone.Model.extend({
        initialize: function() {
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
            canvasMaxSize: 600,
            canvasSize: 600,
            container: '#skritter-container',
            orientation: 'vertical',
            transitionSpeed: 200,
            version: '0.0.5'
        },
        resize: function() {
            this.set('appWidth', $(window).width());
            this.set('appHeight', $(window).height());
            if (this.get('appWidth') > this.get('canvasMaxSize')) {
                this.set('canvasSize', this.get('canvasMaxSize'));
            } else {
                this.set('canvasSize', this.get('appWidth'));
            }
            
        }
    });
    
    
    return Settings;
});