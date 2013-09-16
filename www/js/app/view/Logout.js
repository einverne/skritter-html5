/*
 * 
 * View: Logout
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/logout-view.html',
    'view/Toolbar',
    'backbone'
], function(templateLogout, ToolbarView) {
    
    var LogoutView = Backbone.View.extend({
	
	initialize: function() {
	    LogoutView.toolbar = new ToolbarView();
	},
	
	template: templateLogout,
	
	render: function() {
	    this.$el.html(this.template);
	    
	    LogoutView.toolbar.setElement($('#toolbar-container')).render();
	    LogoutView.toolbar.addOption('{back}', 'back-button', ['button']);
	    LogoutView.toolbar.addOption('{logout}', 'logout-button', ['button']);
	    
	    return this;
	},
		
	events: {
	    'click.LogoutView #back-button': 'back',
	    'click.LogoutView #logout-button': 'logout'
	},
	
	back: function() {
	    document.location.hash = '';
	},
		
	logout: function() {
	    Skritter.user.logout();
	    Skritter.application.reload(function() {
		document.location.hash = '';
	    });
	}
    });
    
    
    return LogoutView;
});