/*
 * 
 * Module: Router
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Handles the hashtage navigation, history and switching pages.
 * 
 */
define([
    'view/Home',
    'view/Login',
    'view/Settings',
    'view/Study',
    'backbone'
], function(HomeView, LoginView, SettingsView, StudyView) {
    var Skritter = window.skritter;
    
    var Router = Backbone.Router.extend({
	
	initialize: function() {
	    Router.homeView;
	    Router.loginView;
	    Router.settingsView;
	    Router.studyView;
	},
	
	routes: {
	    '': 'home',
	    'login': 'login',
	    'logout': 'logout',
	    'settings': 'settings',
	    'study': 'study'
	},
		
	home: function() {
	    if (!Router.homeView) {
		Router.homeView = new HomeView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.homeView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	login: function() {
	    if (!Router.loginView) {
		Router.loginView = new LoginView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.loginView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	logout: function() {
	    Skritter.user.logout();
	    window.location.hash = '';
	},
		
	settings: function() {
	    if (!Router.settingsView) {
		Router.settingsView = new SettingsView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.settingsView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	study: function() {
	    if (!Router.studyView) {
		Router.studyView = new StudyView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.studyView.setElement($(Skritter.settings.get('container'))).render();
	    }
	}

    });
    
    
    var initialize = function() {
	Skritter.router = new Router();
	Backbone.history.start();
    };
    
    return {
	initialize: initialize
    };
});