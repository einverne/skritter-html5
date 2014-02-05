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

requirejs(['Libraries'], function() {
    //checks for cordova and runs the application when ready
    if (window.cordova) {
        document.addEventListener('deviceready', run, false);
    } else {
        run();
    }
    //main run function that loads application specific files
    function run() {
        requirejs(['Application'], function(Application) {
            $(document).ready(function() {
                Application.initialize();
            });
        });
    }
});