/*
 * 
 * View: Login
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/login.html',
    'backbone'
], function(templateLogin) {
    var Skritter = window.skritter;
    
    var LoginView = Backbone.View.extend({
	
	template: _.template(templateLogin),
	
	render: function() {
	    this.$el.html(this.template);
	    return this;
	},
		
	events: {
	    'click.LoginView #back': 'back',
	    'click.LoginView #go': 'login'
	},
		
	back: function() {
	    window.location.hash = '';
	},
		
	login: function() {
	    var username = $('#username').val();
	    var password = $('#password').val();
	    if (username === '' || password === '') {
		$('#error-message').text('Username and password cannot be blank.');
		return;
	    }
	    
	    Skritter.facade.show('LOGGING IN');
	    
	    Skritter.user.login(username, password, function(data) {
		if (data.statusCode !== 200) {
		    $('#error-message').text(data.message);
		    Skritter.facade.hide();
		} else {
		    Skritter.application.reload();
		    window.location.hash = '';
		}
	    });
	}
	
    });
    
    return LoginView;
});