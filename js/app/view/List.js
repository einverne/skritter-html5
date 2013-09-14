/*
 * 
 * View: List
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/list-view.html',
    'view/Grid',
    'view/Toolbar',
    'backbone'
], function(templateList, GridView, ToolbarView) {
    
    var ListView = Backbone.View.extend({
	
	initialize: function() {
	    ListView.grid = new GridView();
	    ListView.toolbar = new ToolbarView();
	},
	
	template: templateList,
	
	render: function() {
	    this.$el.html(this.template);
	    
	    ListView.toolbar.setElement($('#toolbar-container')).render();
	    ListView.toolbar.addOption('{back}', 'back-button', ['button']);
	    ListView.toolbar.addOption('{create}', 'create-button', ['button']);
	    
	    ListView.grid.setElement($('#grid-container')).render();	    
	    ListView.grid.addTile('{My Lists}', 'mylists-button');
	    ListView.grid.addTile('{Textbooks}', 'textbooks-button');
	    ListView.grid.addTile('{Published}', 'published-button');
	    ListView.grid.addTile('{Custom}', 'custom-button');
	    ListView.grid.update();
	    
	    return this;
	},
		
	events: {
	    'click.ListView #back-button': 'back'
	},
		
	back: function() {
	    document.location.hash = '';
	}
	
    });
    
    
    return ListView;
});