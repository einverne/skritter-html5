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
        //libraries
        async: '../libs/async',
        backbone: '../libs/backbone-1.1.0.min',
        base64: '../libs/base64',
        bootstrap: '../../bootstrap/js/bootstrap.min',
        'bootstrap.switch': '../../bootstrap/components/switch/js/bootstrap-switch.min',
        'createjs.easel': '../libs/createjs.easel-NEXT.min',
        'createjs.tween': '../libs/createjs.tween-NEXT.min',
        'hammer': '../libs/hammer-1.0.6.min',
        'indexeddb.shim': '../libs/indexeddb.shim',
        jquery: '../libs/jquery-1.10.2.min',
        'jquery.indexeddb': '../libs/jquery.indexeddb',
        'leap': '../libs/leap.min',
        lodash: '../libs/lodash-2.4.1.compat.min',
        moment: '../libs/moment-2.5.0',
        'require.text': '../libs/require.text-2.0.10'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'lodash', 'require.text'],
            exports: 'Backbone'
        },
        bootstrap: ['jquery'],
        'bootstrap.switch': ['jquery'],
        jquery: {
            exports: '$'
        },
        'jquery.indexeddb': ['indexeddb.shim', 'jquery'],
        lodash: {
            exports: '_'
        }
    },
    waitSeconds: 60
});

requirejs(['Libraries'], function() {
    requirejs(['Application'], function(Application) {
        $(document).ready(function() {
            Application.initialize();
        });
    });
});