/**
 * @module Skritter
 * @param Home
 * @param Tests
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Tests'
], function(Home, Tests) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Router.view = {};
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHome',
            'tests': 'showTests'
        },
        /**
         * Shortcut method for traversing backwards through the windows history.
         * 
         * @method back
         */
        back: function() {
            window.history.back();
        },
        /**
         * Shows the homepage which either displays as logged in or out depending on the authentication status.
         * 
         * @method showHome
         */
        showHome: function() {
            if (!Router.view.home) {
                Router.view.home = new Home({el: $('#skritter-container')});
            } else {
                Router.view.home.setElement($('#skritter-container'));
            }
            Router.view.home.render();
        },
        /**
         * Runs and shows the results of the jasmine test cases.
         * 
         * @method showHome
         */
        showTests: function() {
            if (!Router.view.tests) {
                Router.view.tests = new Tests({el: $('#skritter-container')});
            } else {
                Router.view.tests.setElement($('#skritter-container'));
            }
            Router.view.tests.render();
        },
        /**
         * Access method for directly interacting with views via the router.
         * 
         * @method view
         * @returns {Backbone.View}
         */
        view: function() {
           return Router.view;
        }
    });

    /**
     * Initialized the router and enabled pushState based on the environment. If the application
     * is run from a local server then it's disabled to prevent routing errors.
     * 
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