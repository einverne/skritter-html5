/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Options',
    'views/Reviews',
    'views/Study',
    'views/VocabsInfo'
], function(Home, Options, Reviews, Study, VocabsInfo) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //creates the namespace for accessing views directly
            Router.view = {};
            skritter.view = Router.view;
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHome',
            'options': 'showOptions',
            'vocabs/:lang/:writing': 'showVocabsInfo',
            'reviews': 'showReviews',
            'study': 'showStudy'
        },
        /**
         * @method showHome
         */
        showHome: function() {
            if (!Router.view.home) {
                Router.view.home = new Home({el: $(skritter.settings.get('container'))});
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
            } else {
                Router.view.study.setElement($(skritter.settings.get('container')));
            }
            Router.view.study.render();
        },
        /**
         * @method showVocabsInfo
         * @param {String} lang
         * @param {String} writing
         */
        showVocabsInfo: function(lang, writing) {
            if (!Router.view.vocabsInfo) {
                Router.view.vocabsInfo = new VocabsInfo({el: $(skritter.settings.get('container'))});
            } else {
                Router.view.vocabsInfo.setElement($(skritter.settings.get('container')));
            }
            Router.view.vocabsInfo.load(lang, writing);
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