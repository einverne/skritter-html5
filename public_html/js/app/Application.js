/**
 * @module Skritter
 * @class Application
 * @param Api
 * @param Functions
 * @param Log
 * @param Router
 * @param Modal
 * @param Timer
 * @param Assets
 * @param Settings
 * @param User
 * @param IndexedDBAdapter
 * @param async
 * @param moment
 * @author Joshua McFarland
 */

define([
    'Api',
    'Functions',
    'Log',
    'Router',
    'components/Modal',
    'components/Timer',
    'models/Assets',
    'models/Settings',
    'models/User',
    'storage/IndexedDBAdapter',
    'async',
    'moment',
    'bootstrap'
], function(Api, Functions, Log, Router, Modal, Timer, Assets, Settings, User, IndexedDBAdapter, async, moment) {
    /**
     * @method loadAssets
     * @param {Function} callback
     */
    var loadAssets = function(callback) {
        skritter.assets = new Assets();
        callback();
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
        skritter.log = new Log();
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
        if (typeof callback === 'function')
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
     * @method loadTimer
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
            //don't display the loading account modal if initial download
            if (skritter.user.getLastSync())
                skritter.modal.show('progress').setTitle('Loading Account');
            skritter.storage.openDatabase(skritter.user.get('user_id'), function() {
                skritter.async.series([
                    function(callback) {
                        if (!skritter.user.getLastSync()) {
                            skritter.modal.show('progress').setTitle('Initial Download').setProgress('100');
                            skritter.user.sync(function() {
                                document.location.reload(true);
                                skritter.modal.hide();
                                callback();
                            });
                        } else {
                            skritter.user.sync();
                            callback();
                        }
                    },
                    skritter.async.apply(skritter.user.loadAllData),
                    skritter.async.apply(skritter.settings.refreshDate)
                ], function() {
                    skritter.modal.hide();
                    callback();
                });
            });
        } else {
            callback();
        }
    };

    /**
     * @method initialize
     */
    var initialize = function() {
        skritter.async = async;
        skritter.moment = moment;
        skritter.async.series([
            skritter.async.apply(loadApi),
            skritter.async.apply(loadAssets),
            skritter.async.apply(loadFunctions),
            skritter.async.apply(loadLog),
            skritter.async.apply(loadModal),
            skritter.async.apply(loadSettings),
            skritter.async.apply(loadStorage),
            skritter.async.apply(loadTimer),
            skritter.async.apply(loadUser)
        ], function() {
            console.log('application initialized');
            loadRouter();
        });
    };

    return {
        initialize: initialize
    };
});