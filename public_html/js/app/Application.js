/**
 * @module Skritter
 * @class Application
 * @param Api
 * @param Router
 * @param Assets
 * @param Settings
 * @param User
 * @param IndexedDBAdapter
 * @param SQLiteAdapter
 * @author Joshua McFarland
 */
define([
    'Api',
    'Router',
    'model/Assets',
    'model/Settings',
    'model/User',
    'storage/IndexedDBAdapter',
    'storage/SQLiteAdapter'
], function(Api, Router, Assets, Settings, User, IndexedDBAdapter, SQLiteAdapter) {
    /**
     * @method loadRouter
     * @param {Function} callback
     */
    var loadApi = function(callback) {
        Skritter.api = new Api(Skritter.settings.get('apiClientId'), Skritter.settings.get('apiClientSecret'));
        Skritter.api.domain = Skritter.settings.get('apiDomain');
        Skritter.api.root = Skritter.settings.get('apiRoot');
        Skritter.api.version = Skritter.settings.get('apiVersion');
        callback();
    };
    /**
     * @method loadAssets
     * @param {Function} callback
     */
    var loadAssets = function(callback) {
        if (Skritter.fn.isCordova()) {
            //Skritter.assets = new CordovaAssets();
            Skritter.assets = new Assets();
        } else {
            Skritter.assets = new Assets();
        }
        Skritter.assets.once('complete', function() {
            callback();
        });
        Skritter.assets.loadStrokes();
    };
    /**
     * @method loadRouter
     * @param {Function} callback
     */
    var loadRouter = function(callback) {
        Router.initialize();
        callback();
    };
    /**
     * @method loadSettings
     * @param {Function} callback
     */
    var loadSettings = function(callback) {
        Skritter.settings = new Settings();
        callback();
    };
    /**
     * @method loadStorage
     * @param {Function} callback
     */
    var loadStorage = function(callback) {
        if (Skritter.fn.isCordova()) {
            Skritter.storage = new SQLiteAdapter();
        } else {
            Skritter.storage = new IndexedDBAdapter();
        }
        callback();
    };
    /**
     * This loads the user, data and also initiates the syncing process. In the future the callbacks should 
     * probably be cleaned up a bit.
     * 
     * @method loadUser
     * @param {Function} callback
     */
    var loadUser = function(callback) {
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
    };

    /**
     * Initializing the appliation should only happen once when the application is first loaded.
     * 
     * @method initialize
     */
    var initialize = function() {
        Skritter.async.series([
            Skritter.async.apply(loadAssets),
            Skritter.async.apply(loadSettings),
            Skritter.async.apply(loadStorage),
            Skritter.async.apply(loadApi),
            Skritter.async.apply(loadUser),
            Skritter.async.apply(loadRouter)
        ], function() {
            Skritter.facade.hide();
        });
    };
    /**
     * Reloading is used to initialize the application by only loading data that may have changed.
     * It skips loading large static assets from the media folder again.
     * 
     * @method reload
     * @param {Function} callback
     */
    var reload = function(callback) {
        Skritter.async.series([
            Skritter.async.apply(loadUser)
        ], function() {
            Skritter.facade.hide();
            callback();
        });
    };

    return {
        initialize: initialize,
        reload: reload
    };
});