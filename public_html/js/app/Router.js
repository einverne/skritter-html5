/**
 * @module Skritter
 * @param HomeView
 * @param InfoView
 * @param ListsView
 * @param OptionsView
 * @param ReviewsView
 * @param ScratchpadView
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
    'views/Scratchpad',
    'views/Study',
    'views/Vocabs',
    'views/admin/RecogEditor',
    'backbone'
], function(HomeView, InfoView, ListsView, OptionsView, ReviewsView, ScratchpadView, StudyView, VocabsView, AdminRecogEditorView) {
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
            //creates the namespace for accessing views directly
            skritter.view = {};
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
            'admin/recog/editor/:id': 'adminRecogEditorView',
            'info/:vocabId': 'infoView',
            'lists': 'listsView',
            'lists/:listId': 'listsView',
            'login': 'handleLogin',
            'logout': 'handleLogout',
            'options': 'optionsView',
            'reviews': 'reviewsView',
            'scratchpad/:lang': 'scratchpadView',
            'scratchpad/:lang/:words': 'scratchpadView',
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
         * @param {Number} id
         */
        adminRecogEditorView: function(id) {
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
            if (!Router.adminRecogEditorView) {
                Router.adminRecogEditorView = new AdminRecogEditorView({el: $(skritter.settings.get('container'))});
            } else {
                Router.adminRecogEditorView.setElement($(skritter.settings.get('container')));
            }
            Router.adminRecogEditorView.set(id);
            Router.adminRecogEditorView.render();
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
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
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
         */
        listsView: function(listId) {
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
            if (!Router.listsView) {
                Router.listsView = new ListsView({el: $(skritter.settings.get('container'))});
            } else {
                Router.listsView.setElement($(skritter.settings.get('container')));
            }
            Router.listsView.set(listId);
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
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
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
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
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
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
            if (!Router.studyView) {
                Router.studyView = new StudyView({el: $(skritter.settings.get('container'))}).render();
                skritter.view.study = Router.studyView;
            } else {
                Router.studyView.setElement($(skritter.settings.get('container'))).render();
            }
        },
        /**
         * @method scratchpadView
         * @param {String} lang
         * @param {String} words
         */
        scratchpadView: function(lang, words) {
            if (!Router.scratchpadView) {
                Router.scratchpadView = new ScratchpadView({el: $(skritter.settings.get('container'))});
            } else {
                Router.scratchpadView.setElement($(skritter.settings.get('container')));
            }
            Router.scratchpadView.set(lang, words);
            Router.scratchpadView.render();
        },
        /**
         * @method vocabsView
         * @param {String} sort
         */
        vocabsView: function(sort) {
            if (!skritter.user.isLoggedIn()) {
                this.defaultRoute();
                return;
            }
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