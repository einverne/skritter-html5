/**
 * @module Skritter
 * @param HomeView
 * @param InfoView
 * @param ListsView
 * @param OptionsView
 * @param ReviewsView
 * @param StudyView
 * @param VocabsView
 * @param AdminRecogEditorView
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Info',
    'views/Lists',
    'views/Options',
    'views/Reviews',
    'views/Study',
    'views/Vocabs',
    'views/admin/RecogEditor',
    'backbone'
], function(HomeView, InfoView, ListsView, OptionsView, ReviewsView, StudyView, VocabsView, AdminRecogEditorView) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //load up the home since it contains a global click event
            Router.homeView = new HomeView({el: $(skritter.settings.get('container'))});
            //stop the timer when the view has moved from study
            this.on('route', function(route) {
                if (route !== 'studyView')
                    skritter.timer.stop();
            });
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'homeView',
            'admin/recog/editor': 'adminRecogEditorView',
            'info/:vocabId': 'infoView',
            'lists': 'listsView',
            'lists/:listId': 'listsView',
            'lists/:listId/:sectionId': 'listsView',
            'login': 'handleLogin',
            'logout': 'handleLogout',
            'options': 'optionsView',
            'reviews': 'reviewsView',
            'study': 'studyView',
            'vocabs': 'vocabsView',
            'vocabs/:filterBy': 'vocabsView',
            '*default': 'defaultRoute'
        },
        /**
         * @method back
         */
        back: function() {
            if (Backbone.history.history.length > 1) {
                Backbone.history.history.back();
            } else {
                this.navigate('/', {trigger: true, replace: true});
            }
        },
        /**
         * @method defaultRoute
         */
        defaultRoute: function() {
            this.navigate('/', {trigger: true});
        },
        /**
         * @method adminRecogEditorView
         */
        adminRecogEditorView: function() {
            if (!Router.adminRecogEditorView) {
                Router.adminRecogEditorView = new AdminRecogEditorView({el: $(skritter.settings.get('container'))}).render();
            } else {
                Router.adminRecogEditorView.setElement($(skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method homeView
         */
        homeView: function() {
            if (!Router.homeView) {
                Router.homeView = new HomeView({el: $(skritter.settings.get('container'))}).render();
            } else {
                Router.homeView.setElement($(skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method infoView
         * @param {String} vocabId
         */
        infoView: function(vocabId) {
            if (!Router.infoView) {
                Router.infoView = new InfoView({el: $(skritter.settings.get('container'))});
            } else {
                Router.infoView.setElement($(skritter.settings.get('container')));
            }
            Router.infoView.set(vocabId);
            Router.infoView.render();
        },
        /**
         * @method listsView
         * @param {String} listId
         * @param {String} sectionId
         */
        listsView: function(listId, sectionId) {
            if (!Router.listsView) {
                Router.listsView = new ListsView({el: $(skritter.settings.get('container'))});
            } else {
                Router.listsView.setElement($(skritter.settings.get('container')));
            }
            Router.listsView.set(listId, sectionId);
            Router.listsView.render();
        },
        /**
         * @method handleLogin
         */
        handleLogin: function() {
            skritter.modal.show('login');
        },
        /**
         * @method handleLogout
         */
        handleLogout: function() {
            skritter.user.logout();
            return false;
        },
        /**
         * @method optionsView
         */
        optionsView: function() {
            if (!Router.optionsView) {
                Router.optionsView = new OptionsView({el: $(skritter.settings.get('container'))}).render();
            } else {
                Router.optionsView.setElement($(skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method reviewsView
         */
        reviewsView: function() {
            if (!Router.reviewsView) {
                Router.reviewsView = new ReviewsView({el: $(skritter.settings.get('container'))}).render();
            } else {
                Router.reviewsView.setElement($(skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method studyView
         */
        studyView: function() {
            if (!Router.studyView) {
                Router.studyView = new StudyView({el: $(skritter.settings.get('container'))}).render();
            } else {
                Router.studyView.setElement($(skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method vocabsView
         * @param {String} sort
         */
        vocabsView: function(sort) {
            if (!Router.vocabsView) {
                Router.vocabsView = new VocabsView({el: $(skritter.settings.get('container'))});
            } else {
                Router.vocabsView.setElement($(skritter.settings.get('container')));
            }
            Router.vocabsView.render();
        }
    });

    /**
     * @method initialize
     * @return {Router} Returns the application hashtag routing instance
     */
    var initialize = function() {
        var router = new Router();
        Backbone.history.start(skritter.fn.isLocal() ? {} : {pushState: true});
        return router;
    };

    return {
        initialize: initialize
    };
});