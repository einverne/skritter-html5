/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'models/Api',
    'models/Assets',
    'Functions',
    'models/storage/IndexedDBAdapter',
    'views/components/modal',
    'Router',
    'models/Settings',
    'views/components/Timer',
    'models/User'
], function(Api, Assets, Functions, IndexedDBAdapter, Modal, Router, Settings, Timer, User) {
    /**
     * Creates the global skritter namescape.
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
            async.apply(loadModal),
            async.apply(loadSettings),
            async.apply(loadStorage),
            async.apply(loadTimer),
            async.apply(loadUser),
            async.apply(loadRouter)
        ], function() {
            console.log('application initialized');
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
     * @method loadModal
     * @param {Function} callback
     */
    var loadModal = function(callback) {
        skritter.modal = new Modal().render();
        callback();
    };
    /**
     * @method loadRouter
     * @param {Function} callback
     */
    var loadRouter = function(callback) {
        skritter.router = Router.initialize();
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
        skritter.storage = new IndexedDBAdapter();
        callback();
    };
    /**
     * @method timer
     * @param {Function} callback
     */
    var loadTimer = function(callback) {
        skritter.timer = new Timer();
        callback();
    };
    /**
     * @method loadUser
     * @param {Function} callback
     */
    var loadUser = function(callback) {
        skritter.user = new User();
        if (skritter.user.isLoggedIn()) {
            skritter.modal.show('progress');
            async.series([
                async.apply(skritter.storage.openDatabase, skritter.user.get('user_id')),
                async.apply(skritter.user.loadData),
                function(callback) {
                    if (skritter.user.getLastSync() === 0) {
                        skritter.modal.setTitle('Initial Download').setProgress('100', '');
                        skritter.user.sync(function() {
                            skritter.scheduler.loadAll(function() {
                                skritter.modal.hide();
                                callback();
                            });
                        });
                    } else {
                        skritter.modal.hide();
                        skritter.user.sync();
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