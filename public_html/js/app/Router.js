/**
 * @module Skritter
 * @param Home
 * @param Options
 * @param Reviews
 * @param Study
 * @param Tests
 * @param VocabInfo
 * @param VocabList
 * @param VocabListSection
 * @param VocabLists
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Options',
    'views/Reviews',
    'views/Study',
    'views/Tests',
    'views/vocabs/VocabInfo',
    'views/vocabs/VocabList',
    'views/vocabs/VocabListSection',
    'views/vocabs/VocabLists'
], function(Home, Options, Reviews, Study, Tests, VocabInfo, VocabList, VocabListSection, VocabLists) {
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
            'vocab/list': 'showVocabLists',
            'vocab/list/:id': 'showVocabList',
            'vocab/list/:listId/:sectionId': 'showVocabListSection',
            'vocab/:lang/:writing': 'showVocabInfo',
            'review': 'showReviews',
            'study': 'showStudy',
            'tests': 'showTests'
        },
        /**
         * @method back
         */
        back: function() {
            window.history.back();
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
         * @method showTests
         */
        showTests: function() {
            if (!Router.view.tests) {
                Router.view.tests = new Tests({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.tests.setElement($(skritter.settings.get('container')));
            }
            Router.view.tests.render();
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
         * @method showVocabList
         * @param {String} listId
         */
        showVocabList: function(listId) {
            if (!Router.view.vocabList) {
                Router.view.vocabList = new VocabList({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabList.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabList.load(listId).render();
        },
        /**
         * @method showVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         */
        showVocabListSection: function(listId, sectionId) {
            if (!Router.view.vocabListSection) {
                Router.view.vocabListSection = new VocabListSection({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabListSection.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabListSection.load(listId, sectionId).render();
        },
        /**
         * @method showVocabLists
         */
        showVocabLists: function() {
            if (!Router.view.vocabLists) {
                Router.view.vocabLists = new VocabLists({el: $(skritter.settings.get('container'))});
                skritter.view = Router.view;
            } else {
                Router.view.vocabLists.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabLists.load().render();
        }
    });

    /**
     * @method initialize
     */
    var initialize = function() {
        skritter.router = new Router();
        Backbone.history.start(skritter.fn.isLocal() ? {} : {pushState: true});
    };

    return {
        initialize: initialize
    };
});