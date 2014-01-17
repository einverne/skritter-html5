/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Study'
], function(Home, Study) {
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