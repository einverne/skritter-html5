/**
 * This is the main load file which contains all of the RequireJS paths.
 * It also detects if Cordova is present to handle document ready slightly differently.
 * 
 * @author Joshua McFarland
 */
require.config({
    baseUrl: 'js/app/',
    main: 'Application',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        //directories
        component: 'view/component',
        media: '../../media',
        prompt: 'view/prompt',
        template: '../../template',
        //libraries
        async: '../lib/async',
        backbone: '../lib/backbone-1.1.0.min',
        base64: '../lib/base64',
        bootstrap: '../lib/bootstrap-3.0.0.min',
        'createjs.easel': '../lib/createjs.easeljs-0.7.0.min',
        'createjs.preload': '../lib/createjs.preloadjs-0.4.0.min',
        'createjs.sound': '../lib/createjs.soundjs-0.5.0.min',
        'createjs.tween': '../lib/createjs.tweenjs-0.5.0.min',
        jquery: '../lib/jquery-1.10.2.min',
        'jquery.hammer': '../lib/jquery.hammerjs-1.0.5.min',
        'jquery.indexeddb': '../lib/jquery.indexeddb',
        leap: '../lib/leap',
        lodash: '../lib/lodash.compat-2.2.1.min',
        'require.text': '../lib/require.text-2.0.10'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'lodash', 'require.text'],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery']
        },
        jquery: {
            exports: '$'
        },
        'jquery.hammer': {
            deps: ['jquery']
        },
        'jquery.indexeddb': {
            deps: ['jquery']
        },
        leap: {
            exports: 'Leap'
        },
        lodash: {
            exports: '_'
        }
    }
});

require([
    'Application',
    'async',
    'bootstrap',
    'jquery'
], function(Application, Async) {
    //creates the global skritter namespace
    window.Skritter = (function(Skritter) {
        return Skritter;
    })(window.Skritter || {});
    //loads the application into the global namespace
    function start() {
        Skritter.application = Application;
        Skritter.application.initialize();
    }
    //initializes the application once the dom is ready or device is ready
    $(document).ready(function() {
        Skritter.async = Async;
        if (window.cordova || window.PhoneGap || window.phonegap) {
            document.addEventListener('deviceready', start, false);
        } else {
            start();
        }

    });
});