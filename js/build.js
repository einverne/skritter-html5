({
    appDir: "../",
    baseUrl: "./js/app",
    dir: "../build",
    fileExclusionRegExp: /^(r|build)\.js$/,
    name: "Skritter",
    removeCombined: true,
    paths: {
	backbone: '../lib/backbone.min',
	base64: '../lib/base64.min',
	boxblurFilter: '../lib/filters/boxblur',
	colorFilter: '../lib/filters/color',
	createjs: '../lib/createjs.min',
	filter: '../lib/filters/filter',
	hammer: '../lib/jquery.hammer.min',
	jquery: '../lib/jquery.min',
	modernizr: '../lib/modernizr.min',
	lodash: '../lib/lodash.compat.min',
	ready: '../lib/dom.ready.min',
	text: '../lib/require.text.min'
    },
    shim: {
	backbone: {
	    deps: ['jquery', 'lodash', 'text'],
	    exports: 'Backbone'
	},
	boxblurFilter: {
	    deps: ['filter']
	},
	colorFilter: {
	    deps: ['filter']
	},
	hammer: {
	    deps: ['jquery']
	}
    }
})