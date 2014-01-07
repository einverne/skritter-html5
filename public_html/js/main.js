/**
 * @module Skritter
 * @author Joshua McFarland
 */
requirejs.config({
    baseUrl: 'js/app',
    urlArgs: function() {
        //removes the added url args from testing environment 
        var hostname = document.location.hostname || window.location.hostname || location.hostname;
        if (hostname === 'localhost' || hostname === '192.168.1.10')
            return 'cb=' + Math.random();
    }(),
    paths: {
        //directories
        templates: '../../templates',
        specs: '../../tests/specs/',
        //libraries
        async: '../libs/async',
        backbone: '../libs/backbone-1.1.0',
        base64: '../libs/base64',
        bootstrap: '../../bootstrap/js/bootstrap',
        'createjs.easel': '../libs/createjs.easel-NEXT.min',
        'createjs.tween': '../libs/createjs.tween-NEXT.min',
        'indexeddb.shim': '../libs/indexeddb.shim',
        jasmine: '../../tests/libs/jasmine',
        'jasmine-html': '../../tests/libs/jasmine-html',
        jquery: '../libs/jquery-2.0.3',
        'jquery.hammer': '../libs/jquery.hammer-1.0.5',
        'jquery.indexeddb': '../libs/jquery.indexeddb',
        lodash: '../libs/lodash-2.4.1',
        moment: '../libs/moment-2.4.0',
        'require.text': '../libs/require.text-2.0.10'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'lodash', 'require.text'],
            exports: 'Backbone'
        },
        bootstrap: ['jquery'],
        'jasmine-html': {
            deps: ['jasmine', 'jquery'],
            exports: 'jasmine'
        },
        jquery: {
            exports: '$'
        },
        'jquery.hammer': ['jquery'],
        'jquery.indexeddb': ['indexeddb.shim', 'jquery'],
        lodash: {
            exports: '_'
        }
    },
    waitSeconds: 30
});

/**
 * Checks the application cache for updates then force reloads from the server
 * if a new version is found. Even after the application cache is updated it doesn't
 * update the existing files until after the next page reload.
 */
window.addEventListener('load', function() {
    window.applicationCache.addEventListener('updateready', function() {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY)
            window.location.reload(true);
    }, false);
}, false);

if (document.location.pathname.indexOf('tests.html') > -1) {
    /**
     * Loads the jasmine test cases.
     */
    requirejs(['Application', 'Jasmine'], function() {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;
        var htmlReporter = new jasmine.HtmlReporter();
        jasmineEnv.addReporter(htmlReporter);
        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };
        var specs = [];
        specs.push('specs/Functions');
        $(document).ready(function() {
            requirejs(specs, function() {
                jasmineEnv.execute();
            });
        });
    });
} else {
    /**
     * Loads the application.
     * 
     * @param Application
     */
    requirejs(['Application'], function(Application) {
        /**
         * Creates the global Skritter namespace when the application first opened.
         * @param skritter
         */
        window.skritter = (function(skritter) {
            return skritter;
        })(window.skritter || {});
        /**
         * Loads the application once the DOM has been fully loaded.
         */
        $(document).ready(function() {
            skritter.application = Application;
            Application.initialize();
        });
    });
}