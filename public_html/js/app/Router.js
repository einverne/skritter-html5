/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Info',
    'views/Study'
], function(Home, Info, Study) {
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
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHome',
            'info/:lang/:writing': 'showInfo',
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
         * @method showInfo
         * @param {String} lang
         * @param {String} writing
         */
        showInfo: function(lang, writing) {
            if (!Router.view.info) {
                Router.view.info = new Info({el: $(skritter.settings.get('container'))});
            } else {
                Router.view.info.setElement($(skritter.settings.get('container')));
            }
            Router.view.info.load(lang, writing);
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