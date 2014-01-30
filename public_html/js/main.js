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
        spec: '../../tests/spec/',
        //libraries
        async: '../libs/async',
        hammer: '../libs/hammer-1.0.6.min',
        moment: '../libs/moment-2.5.0',
        'require.text': '../libs/require.text-2.0.10'
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