/**
 * @module Skritter
 * @submodule View
 * @param HomeView
 * @param InfoView
 * @param LoginView
 * @param OptionsView
 * @param StudyView
 * @param VocabView
 * @param RecogEditor
 * @author Joshua McFarland
 */
define([
    'view/Home',
    'view/Info',
    'view/Login',
    'view/Options',
    'view/Study',
    'view/Vocab',
    'view/admin/RecogEditor',
    'backbone'
], function(HomeView, InfoView, LoginView, OptionsView, StudyView, VocabView, RecogEditor) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'homeView',
            'info/:id': 'infoView',
            'login': 'loginView',
            'logout': 'logout',
            'options': 'optionsView',
            'recog/editor': 'recogEditorView',
            'study': 'studyView',
            'vocab': 'vocabView'
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
         * @method infoView
         * @param {Number} id
         */
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
         * @method recogEditorView
         */
        recogEditorView: function() {
            if (!Router.recogEditorView) {
                Router.recogEditorView = new RecogEditor({el: $(Skritter.settings.get('container'))}).render();
            } else {
                Router.recogEditorView.setElement($(Skritter.settings.get('container'))).render();
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
        },
        /**
         * @method vocabView
         */
        vocabView: function() {
            if (!Router.vocabView) {
                Router.vocabView = new VocabView({el: $(Skritter.settings.get('container'))}).render();
            } else {
                Router.vocabView.setElement($(Skritter.settings.get('container'))).render();
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