/*
 * 
 * Router: Router
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'view/About',
    'view/Home',
    'view/Info',
    'view/Login',
    'view/Logout',
    'view/Options',
    'view/Study',
    'view/admin/ParamBuilder',
    'backbone'
], function(AboutView, HomeView, InfoView, LoginView, LogoutView, OptionsView, StudyView, ParamBuilderView) {
    
    var Router = Backbone.Router.extend({
	
	initialize: function() {
	    Router.aboutView;
	    Router.homeView;
	    Router.infoView;
	    Router.loginView;
	    Router.logoutView;
	    Router.optionsView;
	    Router.paramBuilderView;
	    Router.studyView;
	},
		
	routes: {
	    '': 'homeView',
            'about': 'aboutView',
	    'info/:id': 'infoView',
	    'login': 'loginView',
	    'logout': 'logoutView',
	    'options': 'optionsView',
	    'param-builder': 'paramBuilderView',
	    'study': 'studyView'
	},
	
	aboutView: function() {
	    if (!Router.aboutView) {
		Router.aboutView = new AboutView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.aboutView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	homeView: function() {
	    if (!Router.homeView) {
		Router.homeView = new HomeView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.homeView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	infoView: function(id) {
	    if (!id)
		return;
	    
	    if (!Router.infoView) {
		Router.infoView = new InfoView({el: $(Skritter.settings.get('container')), id: id}).render();
	    } else {
		Router.infoView.load(id);
		Router.infoView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	loginView: function() {
	    if (!Router.loginView) {
		Router.loginView = new LoginView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.loginView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	logoutView: function() {
	    if (!Router.logoutView) {
		Router.logoutView = new LogoutView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.logoutView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	optionsView: function() {
	    if (!Router.optionsView) {
		Router.optionsView = new OptionsView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.optionsView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	paramBuilderView: function() {
	    if (!Router.paramBuilderView) {
		Router.paramBuilderView = new ParamBuilderView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.paramBuilderView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	studyView: function() {
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