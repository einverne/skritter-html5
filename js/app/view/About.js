/*
 * 
 * View: About
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/about-view.html',
    'view/Grid',
    'view/Toolbar',
    'backbone'
], function(templateAbout, GridView, ToolbarView) {
    
    var AboutView = Backbone.View.extend({
	
	initialize: function() {
	    AboutView.grid = new GridView();
	    AboutView.toolbar = new ToolbarView();
	},
	
	template: templateAbout,
	
	render: function() {
	    this.$el.html(this.template);
	    
	    AboutView.toolbar.setElement(this.$('#toolbar-container')).render();
	    AboutView.toolbar.addOption('{back}', 'back-button', 'button');
	    
	    AboutView.grid.setElement(this.$('#grid-container')).render();
	    
	    return this;
	},
		
	events: {
	    'click.AboutView #back-button': 'back'
	},
	
	back: function() {
	    document.location.hash = '';
	}
    });
    
    
    return AboutView;
});