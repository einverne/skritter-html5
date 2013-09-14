/*
 * 
 * Module: Application
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Api',
    'Functions',
    'Router',
    'SimpTradMap',
    'Storage',
    'Test',
    'model/Assets',
    'model/Manager',
    'model/Settings',
    'model/User',
    'view/Facade',
    'view/Timer',
    'async'
], function(Api, Functions, Router, SimpTradMap, Storage, Test, Assets, Manager, Settings, User, FacadeView, TimerView, Async) {
    
    //loads all of the inital modules required to load the application
    var initialize = function() {
	//remove: only for testing
	Skritter.test = Test;
	
	console.log('initializing application');
	loadFacade();
	loadAsync();
	loadFunctions();
	loadSettings();
	loadSimpTradMap();
	loadUser();
	loadManager();
	loadApi();
	
	Skritter.async.series([
	    Skritter.async.apply(loadAssets),
	    Skritter.async.apply(loadStorage),
	    Skritter.async.apply(loadData),
	    Skritter.async.apply(loadTimer)
	], function() {
	    loadRouter();
	    Skritter.facade.hide();
	});
    };
    
    //partially reloads the application when switching or logging out
    var reload = function(callback) {
	console.log('reloading application');
	Skritter.facade.show('LOADING');
	loadSettings();
	loadUser();
	loadManager();
	
	Skritter.async.series([
	    Skritter.async.apply(loadStorage),
	    Skritter.async.apply(loadData),
	    Skritter.async.apply(loadTimer)
	], function() {
	    Skritter.facade.hide();
	    if (typeof callback === 'function')
		callback();
	});
    };
    
    
    //used to connect directly with the Skritter api
    var loadApi = function() {
	Skritter.api = new Api();
    };
    
    //useful set of functions for better handling async callbacks
    var loadAsync = function() {
	Skritter.async = Async;
    };
    
    //loads all of the initial assets required by the application
    var loadAssets = function(callback) {
	Skritter.assets = new Assets();
	Skritter.assets.once('complete', callback);
	Skritter.assets.loadStrokes();
    };
    
    //checks and loads the users account data
    var loadData = function(callback) {
	console.log('loading data');
	if (Skritter.user.isLoggedIn()) {
	    Skritter.async.series([
		function(callback) {
		    //during first login the entire account should be downloaded
		    if (!Skritter.user.get('lastSync')) {
			Skritter.facade.show('DOWNLOADING ACCOUNT');
			Skritter.manager.downloadAccount(function() {
			    Skritter.user.set('lastSync', Skritter.fn.getUnixTime());
			    callback();
			});
		    } else {
			//todo: add in the initial sync function
			callback();
		    }
		},
		function(callback) {
		    //load the base data required for syncing and studying
		    Skritter.async.series([
			Skritter.async.apply(Skritter.study.decomps.loadAll),
			Skritter.async.apply(Skritter.study.items.loadAll),
			Skritter.async.apply(Skritter.study.params.loadAll),
			Skritter.async.apply(Skritter.study.reviews.loadAll),
			Skritter.async.apply(Skritter.study.srsconfigs.loadAll),
			Skritter.async.apply(Skritter.study.sentences.loadAll),
			Skritter.async.apply(Skritter.study.strokes.loadAll),
			Skritter.async.apply(Skritter.study.vocabs.loadAll)
		    ], function() {	
			callback();
		    });
		}
	    ], callback);
	} else {
	    callback();
	}
    };
    
    //can be toggled on of off to lock the screen from the user
    var loadFacade = function() {
	Skritter.facade = new FacadeView({el: $('#facade-container')});
	Skritter.facade.show('LOADING');
    };
    
    //set of global functions used by the application
    var loadFunctions = function() {
	Skritter.fn = Functions;
    };
    
    //loads the framework of study models and handles syncing
    var loadManager = function() {
	Skritter.manager = new Manager();
    };
    
    //handles all of the hashtag routing
    var loadRouter = function() {
	Router.initialize();
    };
    
    //application settings that can be directly altered by the user
    var loadSettings = function() {
	Skritter.settings = new Settings();
    };
    
    var loadSimpTradMap = function() {
	Skritter.map = JSON.parse(SimpTradMap);
    };
    
    //checks and loads the proper storage method
    var loadStorage = function(callback) {
	if (window.cordova || window.PhoneGap || window.phonegap) {
	    console.log('using sqlite');
	    Skritter.storage = new Storage('sqlite');
	} else {
	    console.log('using indexeddb');
	    Skritter.storage = new Storage('indexeddb');
	}
	if (Skritter.user.isLoggedIn()) {
	    Skritter.storage.openDatabase('skritdata-' + Skritter.user.get('user_id'), 3, function() {
		callback();
	    }); 
	} else {
	    callback();
	}
    };
    
    var loadTimer = function(callback) {
	Skritter.timer = new TimerView();
	if (Skritter.user.isLoggedIn()) {
	    Skritter.async.waterfall([
		function(callback) {
		    Skritter.api.getDateInfo(function(result) {
			callback(null, result);
		    });
		},
		function(result, callback) {
		    Skritter.api.getProgressStats({
			start: result.today
		    }, function(result) {
			Skritter.timer.setOffset(result[0].timeStudied.day);
			callback();
		    });
		}
	    ]);
	}
	callback(); 
    };
    
    //gets the active user and loads user-specific settings
    var loadUser = function() {
	Skritter.user = new User();
	if (localStorage.getItem('activeUser')) {
	    Skritter.user.set(JSON.parse(localStorage.getItem(localStorage.getItem('activeUser'))));
	}
    };
    
    
    return {
	initialize: initialize,
	reload: reload
    };
});