/*
 * 
 * Router: Router
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'view/Home',
    'view/Info',
    'view/List',
    'view/Login',
    'view/Logout',
    'view/Options',
    'view/Study',
    'view/Vocab',
    'view/admin/ParamBuilder',
    'backbone'
], function(HomeView, InfoView, ListView, LoginView, LogoutView, OptionsView, StudyView, VocabView, ParamBuilderView) {
    
    var Router = Backbone.Router.extend({
	
	initialize: function() {
	    Router.homeView;
	    Router.infoView;
	    Router.listView;
	    Router.logoutView;
	    Router.optionsView;
	    Router.paramBuilderView;
	    Router.studyView;
	    Router.vocabView;
	},
		
	routes: {
	    '': 'homeView',
	    'info/:id': 'infoView',
	    'list': 'listView',
	    'list/:listId': 'listView',
	    'list/:listId/section/:sectionId': 'listView',
	    'list/sort/:sort': 'listViewSort',
	    'login': 'loginView',
	    'logout': 'logoutView',
	    'options': 'optionsView',
	    'param-builder': 'paramBuilderView',
	    'param-builder/:bitmapId': 'paramBuilderView',
	    'param-builder/:bitmapId/:paramId': 'paramBuilderView',
	    'study': 'studyView',
	    'vocab': 'vocabView'
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
		Router.infoView = new InfoView({el: $(Skritter.settings.get('container'))});
	    } else {
		Router.infoView.setElement($(Skritter.settings.get('container')));
	    }
	    Router.infoView.load(id);
	    Router.infoView.render();
	},
	
	listView: function(listId, sectionId) {
	    if (!Router.listView) {
		Router.listView = new ListView({el: $(Skritter.settings.get('container'))});
	    } else {
		Router.listView.setElement($(Skritter.settings.get('container')));
	    }
	    Router.listView.setListId(listId);
	    Router.listView.setSectionId(sectionId);
	    Router.listView.render();
	},
		
	listViewSort: function(sort) {
	    if (!Router.listView) {
		Router.listView = new ListView({el: $(Skritter.settings.get('container'))});
	    } else {
		Router.listView.setElement($(Skritter.settings.get('container')));
	    }
	    Router.listView.setSort(sort);
	    Router.listView.render();
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
		
	paramBuilderView: function(bitmapId, paramId) {
	    if (!Router.paramBuilderView) {
		Router.paramBuilderView = new ParamBuilderView({el: $(Skritter.settings.get('container'))});
	    } else {
		Router.paramBuilderView.setElement($(Skritter.settings.get('container')));
	    }
	    Router.paramBuilderView.set(bitmapId, paramId);
	    Router.paramBuilderView.render();
	},
		
	studyView: function() {
	    if (!Router.studyView) {
		Router.studyView = new StudyView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.studyView.setElement($(Skritter.settings.get('container'))).render();
	    }
	},
		
	vocabView: function() {
	    if (!Router.vocabView) {
		Router.vocabView = new VocabView({el: $(Skritter.settings.get('container'))}).render();
	    } else {
		Router.vocabView.setElement($(Skritter.settings.get('container'))).render();
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