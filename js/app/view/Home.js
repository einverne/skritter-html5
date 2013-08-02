define([
    'require.text!template/home.html',
    'backbone'
], function(templateHome) {
    var Skritter = window.skritter;
    
    var HomeView = Backbone.View.extend({
	
	template: _.template(templateHome),
	
	render: function() {
	    this.$el.html(this.template);	
	    
	    //change the display based on user login status
	    if (Skritter.user.isLoggedIn()) {
		$('#login').toggle();
	    } else {
		$('#study').toggle();
		$('#settings').toggle();
		$('#sync').toggle();
		$('#logout').toggle();
	    }
	    
	    $('#version').text(Skritter.settings.get('version'));

	    return this;
	},
		
	events: {
	    'click.HomeView #login': 'login',
	    'click.HomeView #logout': 'logout',
	    'click.HomeView #settings': 'settings',
	    'click.HomeView #study': 'study'
	},
		
	logout: function() {
	    window.location.hash = 'logout';
	},
		
	login: function() {
	    window.location.hash = 'login';
	},
	
	settings: function() {
	    window.location.hash = 'settings';
	},
	
	study: function() {
	    window.location.hash = 'study';
	}
	
    });
    
    return HomeView;
});