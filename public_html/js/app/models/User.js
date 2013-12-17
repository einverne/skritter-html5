/**
 * @module Skritter
 * @submodule Model
 * @param Scheduler
 * @param Sync
 * @param StudyDecomps
 * @param StudyItems
 * @param StudyParams
 * @param StudyReviews
 * @param StudySRSConfigs
 * @param StudySentences
 * @param StudyStrokes
 * @param StudyVocabs
 * @author Joshua McFarland
 */
define([
    'Scheduler',
    'Sync',
    'collections/StudyDecomps',
    'collections/StudyItems',
    'collections/StudyParams',
    'collections/StudyReviews',
    'collections/StudySRSConfigs',
    'collections/StudySentences',
    'collections/StudyStrokes',
    'collections/StudyVocabs',
    'backbone',
    'lz-string'
], function(Scheduler, Sync, StudyDecomps, StudyItems, StudyParams, StudyReviews, StudySRSConfigs, StudySentences, StudyStrokes, StudyVocabs) {
    /**
     * @class User
     */
    var User = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            //load the scheduler for faster scheduling
            skritter.scheduler = new Scheduler();
            //initializes all of the required data collections
            skritter.data = {
                decomps: new StudyDecomps(),
                items: new StudyItems(),
                params: new StudyParams(),
                reviews: new StudyReviews(),
                srsconfigs: new StudySRSConfigs(),
                sentences: new StudySentences(),
                strokes: new StudyStrokes(),
                vocabs: new StudyVocabs()
            };
            //loads the user from localStorage if exists
            if (localStorage.getItem('activeUser'))
                this.set(JSON.parse(LZString.decompress(localStorage.getItem(localStorage.getItem('activeUser')))));
            //perform tasks based login status
            if (this.isLoggedIn()) {
                //sets the api token required for calls
                skritter.api.token = this.get('access_token');
            }
            //stores user settings to localStorage as they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            access_token: null,
            addOffset: 0,
            audio: true,
            expires_in: null,
            lastLogin: null,
            lastSyncChinese: null,
            lastSyncJapanese: null,
            refresh_token: null,
            settings: null,
            syncMethod: 'full',
            token_type: null,
            user_id: null
        },
        /**
         * @method cache
         */
        cache: function() {
            if (this.isLoggedIn())
                localStorage.setItem(this.get('user_id'), LZString.compress(JSON.stringify(this)));
        },
        /**
         * @method addItems
         * @param {Number} limit
         * @param {Function} callback
         */
        addItems: function(limit, callback) {
            var self = this;
            var offset = this.get('addOffset');
            limit = (limit) ? limit : 1;
            var requests = [
                {
                    path: 'api/v' + skritter.api.version + '/items/add',
                    method: 'POST',
                    cache: false,
                    params: {
                        lang: this.getSetting('targetLang'),
                        limit: limit,
                        offset: offset
                    }
                }
            ];
            skritter.async.waterfall([
                //request the new items using a batch request
                function(callback) {
                    skritter.modal.setProgress(100, 'Requesting Items');
                    skritter.api.requestBatch(requests, function(result) {
                        callback(null, result);
                    });
                },
                //start fetching the new items as they are completed
                function(result, callback) {
                    skritter.modal.setProgress(100, 'Getting Items');
                    skritter.api.getBatchCombined(result.id, function(result) {
                        console.log('added items', result);
                    }, function() {
                        callback();
                    });
                },
                //run a fresh sync to get the new items and update
                function(callback) {
                    self.set('addOffset', offset + 1);
                    self.sync(callback);
                }
            ], function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method checkReviewErrors
         * @param {Number} offset
         * @param {Function} callback
         */
        checkReviewErrors: function(callback, offset) {
            offset = (offset && offset > -1) ? offset : this.getLastSync();
            skritter.api.getReviewErrors(offset, function(errors) {
                console.log('Review Errors', errors);
                if (typeof callback === 'function')
                    callback(errors);
            });
        },
        /**
         * Gets the current users properties and settings from the server then saves it.
         * 
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            var self = this;
            if (this.isLoggedIn()) {
                skritter.api.getUser(this.get('user_id'), function(data) {
                    self.set('settings', data);
                    callback(data);
                });
            }
        },
        /**
         * Gets the users current avatar and returns it as an image tag using base64 data.
         * 
         * @method getAvatar
         * @param {String} classes
         * @returns {Image} Returns a base64 image tag
         */
        getAvatar: function(classes) {
            if (classes)
                return "<img src='data:image/png;base64," + this.getSetting('avatar') + "' + class='" + classes + "' />";
            return "<img src='data:image/png;base64," + this.getSetting('avatar') + "' />";
        },
        /**
         * Returns an array of active study parts based on the current language being studied.
         * 
         * @method getActiveStudyParts
         * @returns {Array}
         */
        getActiveStudyParts: function() {
            if (this.isChinese())
                return this.get('settings').chineseStudyParts;
            return this.get('settings').japaneseStudyParts;
        },
        /**
         * @method getDatabaseId
         * @returns {undefined}
         */
        getDatabaseName: function() {
            return this.get('user_id');
        },
        /**
         * Mainly used on tone prompts to determine which font to draw the character from, but
         * it returns the name of the font based on the current target language.
         * 
         * @method getFontName
         * @returns {String}
         */
        getFontName: function() {
            if (this.isChinese())
                return 'simkai';
            return 'kaisho';
        },
        /**
         * Returns the last sync based on the current active language. This is needed so we don't
         * have to delete all of the data when switching languages.
         * 
         * @method getLastSync
         * @returns {Number}
         */
        getLastSync: function() {
            var lastSync = (this.isChinese()) ? this.get('lastSyncChinese') : this.get('lastSyncJapanese');
            if (lastSync)
                return lastSync;
            return 0;
        },
        /**
         * A shortcut method for getting user server settings.
         * 
         * @method getSetting
         * @param {String} name
         * @return {Object}
         */
        getSetting: function(name) {
            return this.get('settings')[name];
        },
        /**
         * Returns the current style which really only applies to Chinese as both,
         * simplified or traditional.
         * 
         * @method getStyle
         * @returns {String}
         */
        getStyle: function() {
            if (this.isJapanese()) {
                return 'ja';
            } else if (this.isChinese() && this.getSetting('addSimplified') && this.getSetting('addTraditional')) {
                return 'zh-both';
            } else if (this.isChinese() && this.getSetting('addSimplified') && !this.getSetting('addTraditional')) {
                return 'zh-simp';
            } else {
                return 'zh-trad';
            }
        },
        /**
         * @method getTextStyle
         * @returns {String}
         */
        getTextStyle: function() {
            if (this.isChinese())
                return 'chinese-text';
            return 'japanese-text';
        },
        /**
         * Returns true if the target language is set to Chinese.
         * 
         * @method isChinese
         * @returns {Boolean}
         */
        isChinese: function() {
            if (this.getSetting('targetLang') === 'zh')
                return true;
            return false;
        },
        /**
         * Returns true if the target language is set to Japanese.
         * 
         * @method isJapanese
         * @returns {Boolean}
         */
        isJapanese: function() {
            if (this.getSetting('targetLang') === 'ja')
                return true;
            return false;
        },
        /**
         * Checks to see if the user is logged in by seeing if a token exists. This might not always work
         * in situations where the token as expired.
         * 
         * @method isLoggedIn
         * @returns {Boolean} True or false pending the users login status
         */
        isLoggedIn: function() {
            if (this.get('access_token'))
                return true;
            return false;
        },
        /**
         * Loads all of the data for the current active user into memory. For small to medium size accounts this is
         * fairly quick, but larger accounts might need to do loading in logical chunks.
         * 
         * @method loadAllData
         * @param {Function} callback
         */
        loadAllData: function(callback) {
            skritter.storage.getSchedule(function(schedule) {
                skritter.scheduler.schedule = schedule;
                skritter.async.parallel([
                    skritter.async.apply(skritter.data.decomps.loadAll),
                    skritter.async.apply(skritter.data.params.loadAll),
                    skritter.async.apply(skritter.data.reviews.loadAll),
                    skritter.async.apply(skritter.data.srsconfigs.loadAll),
                    skritter.async.apply(skritter.data.sentences.loadAll),
                    skritter.async.apply(skritter.data.strokes.loadAll),
                    skritter.async.apply(skritter.data.vocabs.loadAll)
                ], callback);

            });
        },
        /**
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        login: function(username, password, callback) {
            var self = this;
            skritter.api.authenticateUser(username, password, function(result) {
                if (result.statusCode === 200) {
                    self.set(result);
                    skritter.api.token = result.access_token;
                    self.fetch(function() {
                        skritter.storage.openDatabase(skritter.user.get('user_id'), function() {
                            localStorage.setItem('activeUser', result.user_id);
                            self.set('lastLogin', skritter.fn.getUnixTime());
                            callback(result);
                        });
                    });
                } else {
                    callback(result);
                }
            });
        },
        /**
         * Automatically logs the user out and returns them to home.
         * 
         * @method logout
         */
        logout: function() {
            if (this.isLoggedIn()) {
                skritter.modal.show().setBody('Logging Out').noHeader();
                skritter.storage.deleteAllDatabases(function() {
                    localStorage.removeItem('activeUser');
                    skritter.router.navigate('', {trigger: true, replace: true});
                    document.location.reload();
                });
            }
        },
        /**
         * @method setLastSync
         * @param {Number} time
         * @returns {Number}
         */
        setLastSync: function(time) {
            time = (time) ? time : skritter.fn.getUnixTime();
            if (this.isChinese()) {
                this.set('lastSyncChinese', time);
            } else {
                this.set('lastSyncJapanese', time);
            }
            return time;
        },
        /**
         * A shortcut method for changing user server settings.
         * 
         * @method setSetting
         * @param {String} name
         * @param {String} value
         * @return {Backbone.Model}
         */
        setSetting: function(name, value) {
            var settings = this.get('settings');
            settings[name] = value;
            this.set('settings', settings);
            return this;
        },
        /**
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var self = this;
            console.log('syncing from', skritter.moment(this.getLastSync() * 1000).format('YYYY[-]MM[-]DD h:mm:ss a'));
            skritter.async.waterfall([
                /*function(callback) {
                 skritter.modal.setProgress(100, 'Getting Schedule');
                 skritter.api.getItemsCondensed(function(result) {
                 console.log('condensed', result);
                 callback(null, result);
                 });
                 },
                 function(result, callback) {
                 skritter.modal.setProgress(100, 'Saving Schedule');
                 skritter.data.items.add(result.Items, {merge: true});
                 skritter.data.items.cache(callback);
                 },*/
                function() {
                    switch (self.get('syncMethod')) {
                        case 'flash':
                            Sync.methodFlash(callback);
                            break;
                        case 'full':
                            Sync.methodFull(callback);
                            break;
                        case 'partial':
                            Sync.methodPartial(callback);
                            break;
                    }
                }
            ], function() {
                self.setLastSync();
                callback();
            });

            /*skritter.api.getItemsCondensed(function(items) {
             console.log('condensed items', items);
             switch (self.get('syncMethod')) {
             case 'flash':
             Sync.methodFlash(callback);
             break;
             case 'full':
             Sync.methodFull(callback);
             break;
             case 'partial':
             Sync.methodPartial(callback);
             break;
             }
             }, this.getLastSync());*/
        },
        /**
         * A shortcut method for removing user server settings.
         * 
         * @method unsetSetting
         * @param {String} name
         * return {Object}
         */
        unsetSetting: function(name) {
            var settings = this.get('settings');
            delete settings[name];
            this.set('settings', settings);
            return settings;
        }
    });

    return User;
});