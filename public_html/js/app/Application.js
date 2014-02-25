/**
 * @module Skritter
 * @param Api
 * @param Functions
 * @param IndexedDBAdapter
 * @param Log
 * @param Modals
 * @param Params
 * @param Router
 * @param SqlLiteAdapter
 * @param User
 * @author Joshua McFarland
 */
define([
    'models/Api',
    'Functions',
    'models/storage/IndexedDBAdapter',
    'models/Log',
    'views/components/Modals',
    'collections/study/Params',
    'Router',
    'models/storage/SQLiteAdapter',
    'models/User'
], function(Api, Functions, IndexedDBAdapter, Log, Modals, Params, Router, SQLiteAdapter, User) {
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
            async.apply(loadFunctions),
            async.apply(loadLog),
            async.apply(loadModals),
            async.apply(loadParams),
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
                async.apply(skritter.user.scheduler.load),
                function(callback) {
                    if (skritter.user.sync.isFirst()) {
                        skritter.user.sync.start(callback, true);
                    } else {
                        skritter.user.sync.start();
                        callback();
                    }
                }
            ], function() {
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