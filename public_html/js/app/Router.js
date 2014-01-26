/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Options',
    'views/Reviews',
    'views/Study',
    'views/VocabInfo',
    'views/VocabLists'
], function(Home, Options, Reviews, Study, VocabInfo, VocabLists) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //creates the namespace for accessing views in this router
            Router.view = {};
            //creates the namespace for accessing views directly
            skritter.view = {};
            //stop the timer when the view has moved from study
            this.on('route', function(route) {
                if (route !== 'showStudy')
                    skritter.timer.stop();
            });
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHome',
            'options': 'showOptions',
            'vocabs/lists': 'showVocabLists',
            'vocabs/:lang/:writing': 'showVocabInfo',
            'reviews': 'showReviews',
            'study': 'showStudy'
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (!Router.view.home) {
                Router.view.home = new Home({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.home.setElement($(skritter.settings.get('container')));
            }
            Router.view.home.render();
        },
        /**
         * @method showOptions
         */
        showOptions: function() {
            if (!Router.view.options) {
                Router.view.options = new Options({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.options.setElement($(skritter.settings.get('container')));
            }
            Router.view.options.render();
        },
        /**
         * @method showReviews
         */
        showReviews: function() {
            if (!Router.view.reviews) {
                Router.view.reviews = new Reviews({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.reviews.setElement($(skritter.settings.get('container')));
            }
            Router.view.reviews.render();
        },
        /**
         * @method showStudy
         */
        showStudy: function() {
            if (!Router.view.study) {
                Router.view.study = new Study({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.study.setElement($(skritter.settings.get('container')));
            }
            Router.view.study.render();
        },
        /**
         * @method showVocabInfo
         * @param {String} lang
         * @param {String} writing
         */
        showVocabInfo: function(lang, writing) {
            if (!Router.view.vocabInfo) {
                Router.view.vocabInfo = new VocabInfo({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabInfo.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabInfo.load(lang, writing);
        },
        /**
         * @method showVocabLists
         * @param {String} listId
         */
        showVocabLists: function(listId) {
            if (!Router.view.vocabLists) {
                Router.view.vocabLists = new VocabLists({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabLists.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabLists.render();
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