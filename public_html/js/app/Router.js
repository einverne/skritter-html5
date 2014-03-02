/**
 * @module Skritter
 * @param Home
 * @param Study
 * @param Tests
 * @author Joshua McFarland
 */
define([
    'views/Home',
    'views/Study',
    'views/Tests'
], function(Home, Study, Tests) {
    /**
     * @class Router
     */
    var Router = Backbone.Router.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.view = {};
        },
        /**
         * @property {Object} routes
         */
        routes: {
            '': 'showHomeView',
            'study': 'showStudyView',
            'tests': 'showTestsView'
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
         * @method showHomeView
         */
        showHomeView: function() {
            if (!this.view.home) {
                this.view.home = new Home({el: $('#skritter-container')});
            } else {
                this.view.home.setElement($('#skritter-container'));
            }
            this.view.home.render();
        },
        /**
         * Shows the the study view.
         * 
         * @method showStudyView
         */
        showStudyView: function() {
            if (!this.view.study) {
                this.view.study = new Study({el: $('#skritter-container')});
            } else {
                this.view.study.setElement($('#skritter-container'));
            }
            this.view.study.render();
        },
        /**
         * Runs and shows the results of the jasmine test cases.
         * 
         * @method showTestsView
         */
        showTestsView: function() {
            if (!this.view.tests) {
                this.view.tests = new Tests({el: $('#skritter-container')});
            } else {
                this.view.tests.setElement($('#skritter-container'));
            }
            this.view.tests.render();
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