/**
 * @module Skritter
 * @param Api
 * @param Assets
 * @param Functions
 * @param IndexedDBAdapter
 * @param Log
 * @param Modals
 * @param Params
 * @param Router
 * @param Settings
 * @param SQLiteAdapter
 * @param User
 * @author Joshua McFarland
 */
define([
    'models/Api',
    'models/Assets',
    'Functions',
    'models/storage/IndexedDBAdapter',
    'models/Log',
    'views/components/Modals',
    'collections/study/Params',
    'Router',
    'models/Settings',
    'models/storage/SQLiteAdapter',
    'models/User'
], function(Api, Assets, Functions, IndexedDBAdapter, Log, Modals, Params, Router, Settings, SQLiteAdapter, User) {
    /**
     * Reserves the global skritter namespace if it doesn't already exist.
     * @param skritter
     */
    window.skritter = (function(skritter) {
        return skritter;
    })(window.skritter || {});
    /**
     * @method initialize
     */
    var initialize = function() {
        async.series([
            async.apply(loadApi),
            async.apply(loadAssets),
            async.apply(loadFunctions),
            async.apply(loadLog),
            async.apply(loadModals),
            async.apply(loadParams),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadUser)
        ], function() {
            Router.initialize();
        });
    };
    /**
     * @method loadApi
     * @param {Function} callback
     */
    var loadApi = function(callback) {
        skritter.api = new Api();
        callback();
    };
    /**
     * @method loadAssets
     * @param {Function} callback
     */
    var loadAssets = function(callback) {
        skritter.assets = new Assets();
        callback();
    };
    /**
     * @method loadFunctions
     * @param {Function} callback
     */
    var loadFunctions = function(callback) {
        skritter.fn = Functions;
        callback();
    };
    /**
     * @method loadLog
     * @param {Function} callback
     */
    var loadLog = function(callback) {
        window.log = new Log().console;
        callback();
    };
    /**
     * @method loadModals
     * @param {Function} callback
     */
    var loadModals = function(callback) {
        skritter.modals = new Modals({el: $('#modals-container')}).render();
        callback();
    };
    /**
     * @method loadParams
     * @param {Function} callback
     */
    var loadParams = function(callback) {
        skritter.params = new Params();
        callback();
    };
    /**
     * @method loadSettings
     * @param {Function} callback
     */
    var loadSettings = function(callback) {
        skritter.settings = new Settings();
        callback();
    };
    /**
     * @method loadStorage
     * @param {Function} callback
     */
    var loadStorage = function(callback) {
        if (window.cordova) {
            skritter.storage = new SQLiteAdapter();
        } else {
            skritter.storage = new IndexedDBAdapter();
        }
        callback();
    };
    /**
     * @method loadUser
     * @param {Function} callback
     */
    var loadUser = function(callback) {
        skritter.user = new User();
        if (skritter.user.isLoggedIn()) {
            async.series([
                async.apply(skritter.storage.openDatabase, skritter.user.get('user_id')),
                function(callback) {
                    if (skritter.user.sync.isFirst()) {
                        skritter.user.sync.start(callback, true);
                    } else {
                        skritter.user.sync.start();
                        callback();
                    }
                },
                function(callback) {
                    skritter.modals.show('default', callback)
                            .set('.modal-header', false)
                            .set('.modal-body', 'LOADING', 'text-center')
                            .set('.modal-footer', false);
                },
                async.apply(skritter.user.scheduler.load)
            ], function() {
                skritter.modals.hide();
                callback();
            });
        } else {
            callback();
        }
    };
    
    return {
        initialize: initialize
    };
});