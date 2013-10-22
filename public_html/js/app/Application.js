/**
 * @module Skritter
 * @class Application
 * @param Api
 * @param Functions
 * @param Router
 * @param Facade
 * @param Timer
 * @param Assets
 * @param Settings
 * @param User
 * @param IndexedDBAdapter
 * @param Async
 * @author Joshua McFarland
 */
define([
    'Api',
    'Functions',
    'Router',
    'component/Facade',
    'component/Timer',
    'model/Assets',
    'model/Settings',
    'model/User',
    'storage/IndexedDBAdapter',
    'async',
    'bootstrap',
    'jquery'
], function(Api, Functions, Router, Facade, Timer, Assets, Settings, User, IndexedDBAdapter, Async) {
    /**
     * Creates the global Skritter namespace when the application first opened.
     * @param Skritter
     */
    window.Skritter = (function(Skritter) {
        return Skritter;
    })(window.Skritter || {});
    
    /**
     * @property {Object} application
     */
    var application = {
        /**
         * @method loadRouter
         * @param {Function} callback
         */
        loadApi: function(callback) {
            Skritter.api = new Api(Skritter.settings.get('apiClientId'), Skritter.settings.get('apiClientSecret'));
            Skritter.api.domain = Skritter.settings.get('apiDomain');
            Skritter.api.root = Skritter.settings.get('apiRoot');
            Skritter.api.version = Skritter.settings.get('apiVersion');
            callback();
        },
        /**
         * Loads the async utility into the Skriter namescape for easy usage.
         * 
         * @method loadAsync
         */
        loadAsync: function() {
            Skritter.async = Async;
        },
        /**
         * Loads the proper assets module depending on the load environment. Returns a
         * callback one the required assets have preloaded.
         * 
         * @method loadAssets
         * @param {Function} callback
         */
        loadAssets: function(callback) {
            Skritter.assets = new Assets();
            Skritter.assets.once('complete', function() {
                callback();
            });
            Skritter.assets.loadStrokes();
        },
        /**
         * @method loadFacade
         * @returns {Facade}
         */
        loadFacade: function() {
            Skritter.facade = new Facade();
            return Skritter.facade;
        },
        /**
         * @method loadFunctions
         * @param {Function} callback
         */
        loadFunctions: function(callback) {
            Skritter.fn = Functions;
            callback();
        },
        /**
         * @method loadRouter
         * @param {Function} callback
         */
        loadRouter: function(callback) {
            Router.initialize();
            callback();
        },
        /**
         * @method loadSettings
         * @param {Function} callback
         */
        loadSettings: function(callback) {
            Skritter.settings = new Settings();
            callback();
        },
        /**
         * Loads the storage adapter based on the current environment the application has been
         * loaded from.
         * 
         * @method loadStorage
         * @param {Function} callback
         */
        loadStorage: function(callback) {
            Skritter.storage = new IndexedDBAdapter();
            callback();
        },
        /**
         * Loads the timer and attempts to pull the current study time for the day from the server.
         * 
         * @method loadTimer
         * @param {Function} callback
         */
        loadTimer: function(callback) {
            Skritter.timer = new Timer();
            if (Skritter.user.isLoggedIn()) {
                Skritter.timer.sync(true);
            }
            callback();
        },
        /**
         * This loads the user, data and also initiates the syncing process. In the future the callbacks should 
         * probably be cleaned up a bit.
         * 
         * @method loadUser
         * @param {Function} callback
         */
        loadUser: function(callback) {
            Skritter.user = new User();
            if (Skritter.user.isLoggedIn()) {
                Skritter.api.token = Skritter.user.get('access_token');
                Skritter.storage.openDatabase('skritdata-' + Skritter.user.get('user_id'), function() {
                    Skritter.user.loadAllData(function() {
                        Skritter.user.sync(function() {
                            callback();
                        });
                    });
                });
            } else {
                callback();
            }
        },

        /**
         * Initializing the appliation should only happen once when the application is first loaded.
         * 
         * @method initialize
         */
        initialize: function() {
            this.loadFacade().show('loading');
            this.loadAsync();
            Skritter.async.series([
                Skritter.async.apply(this.loadFunctions),
                Skritter.async.apply(this.loadAssets),
                Skritter.async.apply(this.loadSettings),
                Skritter.async.apply(this.loadStorage),
                Skritter.async.apply(this.loadApi),
                Skritter.async.apply(this.loadUser),
                Skritter.async.apply(this.loadTimer),
                Skritter.async.apply(this.loadRouter)
            ], function() {
                Skritter.facade.hide();
            });
        },
        /**
         * Reloading is used to initialize the application by only loading data that may have changed.
         * It skips loading large static assets from the media folder again.
         * 
         * @method reload
         * @param {Function} callback
         */
        reload: function(callback) {
            Skritter.async.series([
                Skritter.async.apply(this.loadUser)
            ], function() {
                Skritter.facade.hide();
                callback();
            });
        }
    };

    //initializes the application once the dom is ready or device is ready
    $(document).ready(function() {
        Skritter.application = application;
        Skritter.application.initialize();
    });
});