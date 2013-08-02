require.config({
    baseUrl: "../js/app",
    urlArgs: 'cb=' + Math.random(),
    paths: {
	//copy of project paths
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
	'require.text': '../lib/require.text-2.0.9',
	
	//jasmine specific requirements
	jasmine: '../../test/lib/jasmine',
	'jasmine-html': '../../test/lib/jasmine-html',
	spec: '../../test/spec/'
    },
    shim: {
	underscore: {
	    exports: "_"
	},
	backbone: {
	    deps: ['lodash', 'jquery'],
	    exports: 'Backbone'
	},
	'createjs.filter.boxblur': {
	    deps: ['createjs.filter']
	},
	'createjs.filter.color': {
	    deps: ['createjs.filter']
	},
	jasmine: {
	    exports: 'jasmine'
	},
	'jasmine-html': {
	    deps: ['jasmine'],
	    exports: 'jasmine'
	},
	lodash: {
	    exports: '_'
	}
    }
});


window.store = "SkritterStore"; // override local storage store name - for testing

require(['lodash', 'jquery', 'jasmine-html'], function(_, $, jasmine){

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [];

  //specs.push('spec/Application');

  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });

});
