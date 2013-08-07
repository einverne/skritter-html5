/*
 * 
 * Module: main
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Configures requirejs for use and initializes the application.
 * 
 */
require.config({    
    baseUrl: 'js/app',
    
    urlArgs: 'cb=' + Math.random(),
    
    main: 'Skritter',
    
    paths: {
	async: '../lib/async',
	backbone: '../lib/backbone-1.0.0.min',
	base64: '../lib/base64',
	'createjs.easel': '../lib/createjs.easeljs-0.6.1.min',
	'createjs.preload': '../lib/createjs.preloadjs-0.3.1.min',
	'createjs.sound': '../lib/createjs.soundjs-0.4.1.min',
	'createjs.tween': '../lib/createjs.tweenjs-0.4.1.min',
	'createjs.filter': '../lib/filters/filter',
	'createjs.filter.boxblur': '../lib/filters/boxblur',
	'createjs.filter.color': '../lib/filters/color',
	jquery: '../lib/jquery-1.10.2.min',
	'jquery.hammer': '../lib/jquery.hammerjs-1.0.5.min',
	lodash: '../lib/lodash.compat-1.3.1.min',
	lzstring: '../lib/lzstring-1.3.0',
	modernizr: '../lib/modernizr-2.6.2.min',
	'require.ready': '../lib/require.domready-2.0.1',
	'require.text': '../lib/require.text-2.0.9'
    },
    
    shim: {
	backbone: {
	    deps: ['jquery', 'lodash', 'require.text'],
	    exports: 'Backbone'
	},
	'createjs.filter.boxblur': {
	    deps: ['createjs.filter']
	},
	'createjs.filter.color': {
	    deps: ['createjs.filter']
	},
	jquery: {
	    exports: '$'
	},
	'jquery.hammer': {
	    deps: ['jquery']
	},
	lodash: {
	    exports: '_'
	}
    }
});

require([
    'Application',
    'require.ready'
], function(Application, Ready) {
    var Skritter = window.skritter;
    
    function start() {
	Skritter.application = Application;
	Skritter.application.initialize();
    }
    
    //initializes the application once the dom is ready or device is ready
    Ready(function() {
	if (window.cordova || window.PhoneGap || window.phonegap) {
	    function deviceReady() {
		start();
	    }
	    document.addEventListener('deviceready', deviceReady, false);
	} else {
	    start();
	}

    });
});