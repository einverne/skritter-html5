/*
 * 
 * View: Login
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/login-view.html',
    'view/Toolbar',
    'require.text!template/login-form.html',
    'backbone'
], function(templateLogin, ToolbarView, templateLoginForm) {
    
    var LoginView = Backbone.View.extend({
	
	initialize: function() {
	    LoginView.toolbar = new ToolbarView();
	},
	
	template: templateLogin,
	
	render: function() {
	    if (Skritter.user.isLoggedIn())
		document.location.hash = '';
	    
	    this.$el.html(this.template);
	    
	    LoginView.toolbar.setElement($('#toolbar-container')).render();
	    LoginView.toolbar.addOption('{back}', 'back-button', ['button']);
	    
	    this.$el.append(templateLoginForm);
	    
	    return this;
	},
		
	events: {
	    'click.LoginView #back-button': 'back',
	    'click.LoginView #login-button': 'login'
	},
	
	back: function() {
	    document.location.hash = '';
	},
		
	login: function() {
	    var username = $('#username').val();
	    var password = $('#password').val();
	    
	    //return if either the username or password fields are blank
	    if (!username || username === '' || !password || password === '') {
		$('#error-message').text('Username and password cannot be blank.');
		return;
	    }
	    
	    Skritter.facade.show('LOGGING IN');
	    Skritter.user.login(username, password, function(auth) {
		if (auth.statusCode !== 200) {
		    $('#error-message').text(auth.message);
		    Skritter.facade.hide();
		    return;
		}
		Skritter.application.reload(function() {
		    document.location.hash = '';
		});
	    });
	}
	
    });
    
    
    return LoginView;
});