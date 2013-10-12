/**
 * @module Skritter
 * @submodule Facade
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class Facade
     */
    var Facade = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        /**
         * @property {Element} el
         */
        el: $('#facade-container'),
        /**
         * @property {String} template Contains the template format loaded into the dom
         */
        template: "<div id='facade-view'><div id='message-area'></div></div>",
        
        /**
         * @method render
         * @returns {Facade}
         */
        render: function() {
            this.$el.html(this.template);
            return this;
        },
        
        /**
         * @method hide
         */	
	hide: function() {
	    $(this.el).hide();
	},
		
        /**
         * @method show
         * @param {String} html HTML and text can be loaded as the diplay message
         * @return {Facade}
         */                
	show: function(html) {
            html = (html) ? html : 'loading';
            this.$('#message-area').html(html);
	    $(this.el).show();
            return this;
	},
        /**
         * @method updateStatus
         * @param {type} html
         * @returns {Facade}
         */      
        updateStatus: function(html) {
            html = (html) ? html : '';
            this.$('#status-area').html(html);
            return this;
        }
    });
    
    
    return Facade;
});