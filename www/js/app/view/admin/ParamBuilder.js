/*
 * 
 * View: ParamBuilder
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'view/Toolbar',
    'backbone'
], function(ToolbarView) {
    
    var ParamBuilderView = Backbone.View.extend({
	
	initialize: function() {
	    ParamBuilderView.toolbar = new ToolbarView();
	},
	
	render: function() {
	    this.$el.html("<div id='parambuilder-view'></div>");
	    
	    ParamBuilderView.toolbar.setElement(this.$('#parambuilder-view')).render();
	    ParamBuilderView.toolbar.addOption('{back}', 'back-button');
	    
	    return this;
	},
	
	events: {
	    'click.ParamBuilderView #back-button': 'back'
	},
		
	back: function() {
	    document.location.hash = '';
	}
	
    });
    
    
    return ParamBuilderView;
});