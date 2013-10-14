/**
 * @module Skritter
 * @submodule View
 * @param AccountView
 * @param HomeView
 * @param LoginView
 * @param StudyView
 * @author Joshua McFarland
 */
define([
    'view/Home',
    'view/Login',
    'view/Options',
    'view/Study',
    'backbone'
], function(HomeView, LoginView, OptionsView, StudyView) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'homeView',
            'login': 'loginView',
            'logout': 'logout',
            'options': 'optionsView',
            'study': 'studyView'
        },
        /**
         * @method homeView
         */
        homeView: function() {
            if (!Router.homeView) {
                Router.homeView = new HomeView({el: $(Skritter.settings.get('container'))}).render();
            } else {
                Router.homeView.setElement($(Skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method logout
         */
        logout: function() {
            Skritter.user.logout();
        },
        /**
         * @method loginView
         */
        loginView: function() {
            if (!Router.loginView) {
                Router.loginView = new LoginView({el: $(Skritter.settings.get('container'))}).render();
            } else {
                Router.loginView.setElement($(Skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method optionsView
         */
        optionsView: function() {
            if (!Router.optionsView) {
                Router.optionsView = new OptionsView({el: $(Skritter.settings.get('container'))}).render();
            } else {
                Router.optionsView.setElement($(Skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method studyView
         */
        studyView: function() {
            if (!Router.studyView) {
                Router.studyView = new StudyView({el: $(Skritter.settings.get('container'))}).render();
            } else {
                Router.studyView.setElement($(Skritter.settings.get('container'))).render();
            }
        }
    });

    /**
     * @method initialize
     * @return {Router} Returns the current router instance
     */
    var initialize = function() {
        Skritter.router = new Router();
        Backbone.history.start();
        return Skritter.router;
    };


    return {
        initialize: initialize
    };
});