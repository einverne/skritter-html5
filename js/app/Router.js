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
    'view/Info',
    'view/admin/Recog',
    'view/Settings',
    'view/Study',
    'backbone'
], function(HomeView, LoginView, InfoView, RecogView, SettingsView, StudyView) {
    var Skritter = window.skritter;
    
    var Router = Backbone.Router.extend({
	
	initialize: function() {
	    Router.homeView;
	    Router.infoView;
	    Router.loginView;
	    Router.recogView;
	    Router.settingsView;
	    Router.studyView;
	},
	
	routes: {
	    '': 'home',
	    'info/:id': 'info',
	    'login': 'login',
	    'recog': 'recog',
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
		
	info: function(id) {
	    if (!id)
		return;
	    
	    if (!Router.infoView) {
		Router.infoView = new InfoView({el: $(Skritter.settings.get('container')), id: id}).render();
	    } else {
		Router.infoView.setVocab(id);
		Router.infoView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	login: function() {
	    if (!Router.loginView) {
		Router.loginView = new LoginView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.loginView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	recog: function() {
	    if (!Router.recogView) {
		Router.recogView = new RecogView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.recogView.setElement($(Skritter.settings.get('container'))).render();
	    }
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