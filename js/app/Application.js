/*
 * 
 * Module: Application
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Frame',
    'Functions',
    'Router',
    'model/Assets',
    'model/Manager',
    'model/Settings',
    'model/User',
    'view/Facade',
    'async',
    'Storage'
], function(Frame, Functions, Router, Assets, Manager, Settings, User, Facade, Async, Storage) {
    var Skritter = window.skritter;
    
    //main initialization function called when the app is first run
    var initialize = function() {
	loadFacade().show();
	loadFunctions();
	loadSettings();
	loadFrame();
	loadUser();
	
	Async.series([
	    Async.apply(loadAssets),
	    Async.apply(loadStorage),
	    Async.apply(loadManager)
	], function() {
	    initialSync(function() {
		loadRouter();
		Skritter.facade.hide();
	    });
	    
	});
    };
    
    var reload = function() {
	Skritter.facade.show();
	loadSettings();
	loadFrame();
	loadUser();
	loadManager(function() {
	    initialSync(function() {
		Skritter.facade.hide();
	    });
	});
    };
    
    
    var initialSync = function(callback) {
	//no syncing if the user is not logged in
	if (!Skritter.user.isLoggedIn()) {
	    callback();
	    return;
	}
	
	if (!Skritter.user.get('lastSync') && Skritter.storage.type !== 'localstorage') {
	    Skritter.facade.show('DOWNLOADING ACCOUNT');
	    Skritter.manager.syncFull(callback);
	    return;
	}
	
	if (Skritter.user.get('lastSync') && Skritter.storage.type !== 'localstorage') {
	    //Skritter.facade.show('SYNCING');
	    //Skritter.manager.syncIncremental(callback);
	    callback();
	    return;
	}
	
	Skritter.facade.show('LOADING ITEMS');
	Skritter.manager.syncMinimal(callback);
    };
    
    var loadAssets = function(callback) {
	Skritter.assets = new Assets();
	Skritter.assets.once('complete', function() {
	    callback();
	});
	Skritter.assets.loadButtons();
	Skritter.assets.loadStrokes();
    };
    
    var loadFacade = function() {
	Skritter.facade = new Facade();
	return Skritter.facade;
    };
    
    var loadFrame = function() {
	Skritter.frame = Frame.vertical;
	Skritter.frame.container();
    };
    
    var loadFunctions = function() {
	Skritter.fn = Functions;
    };
    
    var loadManager = function(callback) {
	Skritter.manager = new Manager();
	Skritter.manager.fromCache(function(result) {
	    if (!result) {
		callback();
		return;
	    }
	    Skritter.manager.setStudyData(result);
	    callback();
	});
    };
    
    var loadRouter = function() {
	Router.initialize();
    };
    
    var loadSettings = function() {
	Skritter.settings = new Settings();
    };
    
    var loadStorage = function(callback) {
	//prioritizes indexeddb over other storage methods
	if (_.contains(navigator.userAgent, 'Chrome/28.0') ||
		_.contains(navigator.userAgent, 'Firefox/22.0') ||
		_.contains(navigator.userAgent, 'MSIE 10.0')) {
	    console.log('using indexeddb');
	    Skritter.storage = new Storage('indexeddb');
	    Skritter.storage.openDatabase('skritdata', 1, function() {
		callback();
	    });
	    return;
	}
	
	//checks if a wrapped mobile app is being used
	if (window.cordova || window.PhoneGap || window.phonegap) {
	    console.log('using sqlite');
	    Skritter.storage = new Storage('sqlite');
	    Skritter.storage.openDatabase('skritdata', '1.0', function() {
		callback();
	    });
	    return;
	}
	
	//defaults to flash style loading
	if (window.localStorage) {
	    console.log('using localstorage');
	    Skritter.storage = new Storage('localstorage');
	    Skritter.storage.database = 'skritdata';
	    Skritter.storage.name = 'skritdata';
	    callback();
	    return;
	}
	
	alert('Unable to load a storage method!');
    };
    
    var loadUser = function() {
	Skritter.user = new User();
    };
    
    
    return {
	initialize: initialize,
	reload: reload
    };
    
});