/**
 * @module Skritter
 * @submodule Model
 * @param Decomps
 * @param Items
 * @param Params
 * @param Reviews
 * @param Scheduler
 * @param Sentences
 * @param SRSConfigs
 * @param Strokes
 * @param Sync
 * @param Vocabs
 * @author Joshua McFarland
 */
define([
    'collections/study/Decomps',
    'collections/study/Items',
    'collections/study/Params',
    'collections/study/Reviews',
    'models/Scheduler',
    'collections/study/Sentences',
    'collections/study/SRSConfigs',
    'collections/study/Strokes',
    'models/Sync',
    'collections/study/Vocabs'
], function(Decomps, Items, Params, Reviews, Scheduler, Sentences, SRSConfigs, Strokes, Sync, Vocabs) {
    /**
     * @class User
     */
    var User = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            User.this = this;
            //initializes all of the required data collections
            skritter.data = {
                decomps: new Decomps(),
                items: new Items(),
                params: new Params(),
                reviews: new Reviews(),
                srsconfigs: new SRSConfigs(),
                sentences: new Sentences(),
                strokes: new Strokes(),
                vocabs: new Vocabs()
            };
            //loads the user from localStorage if exists
            if (localStorage.getItem('activeUser')) {
                try {
                    this.set(JSON.parse(localStorage.getItem(localStorage.getItem('activeUser'))));
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        localStorage.removeItem(localStorage.getItem('activeUser'));
                        localStorage.removeItem('activeUser');
                    }
                }
            }
            //performs special loading tasks when user is logged in
            if (this.isLoggedIn()) {
                skritter.api.set('token', this.get('access_token'));
                skritter.scheduler = new Scheduler();
                skritter.sync = new Sync();
            }
            //stores user settings to localStorage as they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            access_token: null,
            audio: false,
            autoSync: true,
            autoSyncThreshold: 10,
            expires_in: null,
            filterChineseParts: ['defn', 'rdng', 'rune', 'tone'],
            filterJapaneseParts: ['defn', 'rdng', 'rune'],
            lastLogin: null,
            lastSyncChinese: null,
            lastSyncJapanese: null,
            refresh_token: null,
            settings: {},
            token_type: null,
            user_id: 'guest'
        },
        /**
         * @method cache
         */
        cache: function() {
            if (this.isLoggedIn())
                localStorage.setItem(this.get('user_id'), JSON.stringify(this));
        },
        /**
         * @method addItems
         * @param {Number} limit
         * @param {Function} callback
         */
        addItems: function(limit, callback) {
            limit = (limit) ? limit : 1;
            skritter.sync.addItems(this.getLastSync(), limit, callback);
        },
        /**
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            if (this.isLoggedIn())
                skritter.api.getUser(this.get('user_id'), function(data) {
                    User.this.set('settings', data);
                    callback(data);
                });
        },
        /**
         * Returns an array of active parts based on the current language being studied.
         * 
         * @method getActiveParts
         * @returns {Array}
         */
        getActiveParts: function() {
            if (this.isChinese())
                return this.get('filterChineseParts');
            return this.get('filterJapaneseParts');
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
         * @returns {Array}
         */
        getStyle: function() {
            if (this.isJapanese()) {
                return [];
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && this.getSetting('reviewTraditional')) {
                return ['both', 'simp', 'trad'];
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && !this.getSetting('reviewTraditional')) {
                return ['both', 'simp'];
            } else {
                return ['both', 'trad'];
            }
        },
        /**
         * @method getStyleString
         * @returns {String}
         */
        getStyleString: function() {
            if (this.isJapanese()) {
                return 'all';
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && this.getSetting('reviewTraditional')) {
                return 'both';
            } else if (this.isChinese() && this.getSetting('reviewSimplified') && !this.getSetting('reviewTraditional')) {
                return 'simp';
            } else {
                return 'trad';
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
         * @method isLoggedIn
         * @returns {Boolean}
         */
        isLoggedIn: function() {
            if (this.get('access_token'))
                return true;
            return false;
        },
        loadData: function(callback) {
            skritter.modal.setTitle('Loading Data').setProgress('100', null);
            async.series([
                async.apply(skritter.data.decomps.loadAll),
                async.apply(skritter.data.reviews.loadAll),
                async.apply(skritter.scheduler.loadAll),
                async.apply(skritter.data.sentences.loadAll),
                async.apply(skritter.data.srsconfigs.loadAll),
                async.apply(skritter.data.strokes.loadAll)
            ], function() {
                callback();
            });
        },
        login: function(username, password, callback) {
            skritter.api.authenticateUser(username, password, function(result) {
                if (result.statusCode === 200) {
                    User.this.set(result);
                    skritter.api.set('token', result.access_token);
                    User.this.fetch(function() {
                        skritter.storage.openDatabase(skritter.user.get('user_id'), function() {
                            localStorage.setItem('activeUser', result.user_id);
                            User.this.set('lastLogin', skritter.fn.getUnixTime());
                            callback(result);
                        });
                    });
                } else {
                    callback(result);
                }
            });
        },
        logout: function() {
            if (this.isLoggedIn()) {
                skritter.modal.show().setBody('Logging Out').noHeader();
                skritter.storage.deleteDatabase(function() {
                    localStorage.removeItem('activeUser');
                    document.location.reload(true);
                });
            }
        },
        /**
         * @method setActiveParts
         * @param {Array} parts
         */
        setActiveParts: function(parts) {
            if (skritter.user.isChinese()) {
                this.set('filterChineseParts', parts);
            } else {
                this.set('filterJapaneseParts', parts);
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
         * @returns {Backbone.Model}
         */
        sync: function(callback) {
            if (!skritter.sync.syncing()) {
                skritter.sync.full(this.getLastSync(), function(error) {
                    if (!error)
                        User.this.setLastSync();
                    if (typeof callback === 'function')
                        callback(error);
                });
            } else {
                callback();
            }
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