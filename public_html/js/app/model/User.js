/**
 * @module Skritter
 * @submodule Model
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
    'collection/StudyDecomps',
    'collection/StudyItems',
    'collection/StudyParams',
    'collection/StudyReviews',
    'collection/StudySRSConfigs',
    'collection/StudySentences',
    'collection/StudyStrokes',
    'collection/StudyVocabs',
    'backbone'
], function(StudyDecomps, StudyItems, StudyParams, StudyReviews, StudySRSConfigs, StudySentences, StudyStrokes, StudyVocabs) {
    /**
     * @class User
     */
    var User = Backbone.Model.extend({
        initialize: function() {
            Skritter.study = {
                decomps: new StudyDecomps(),
                items: new StudyItems(),
                params: new StudyParams(),
                reviews: new StudyReviews(),
                srsconfigs: new StudySRSConfigs(),
                sentences: new StudySentences(),
                strokes: new StudyStrokes(),
                vocabs: new StudyVocabs()
            };
            if (localStorage.getItem('activeUser')) {
                this.set(JSON.parse(localStorage.getItem(localStorage.getItem('activeUser'))));
            }
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            access_token: null,
            expires_in: null,
            lastLogin: null,
            lastSync: null,
            refresh_token: null,
            settings: null,
            token_type: null,
            user_id: null
        },
        /**
         * @method cache
         */
        cache: function() {
            if (this.isLoggedIn()) {
                localStorage.setItem(this.get('user_id'), JSON.stringify(this));
            }
        },
        /**
         * Quickly caches all of the users current loaded data to storage and returns a callback.
         * 
         * @method cacheAllData
         * @param {Function} callback
         */
        cacheAllData: function(callback) {
            Skritter.async.parallel([
                function(callback) {
                    Skritter.study.decomps.cache(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.study.items.cache(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.study.reviews.cache(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.study.srsconfigs.cache(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.study.sentences.cache(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.study.strokes.cache(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.study.vocabs.cache(function() {
                        callback();
                    });
                }
            ], function() {
                callback();
            });
        },
        /**
         * Gets the current active users properties and settings from the server then saves it.
         * 
         * @method fetch
         * @param {Function} callback
         */
        fetch: function(callback) {
            if (this.isLoggedIn()) {
                Skritter.api.getUser(this.get('user_id'), _.bind(function(data) {
                    this.set('settings', data);
                    callback(data);
                }, this));
            }
        },
        /**
         * Gets the users current avatar and returns it as an image tag using base64 data.
         * 
         * @method getAvatar
         * @param {Boolean} fullsize Specifies wether is return the avatars original size
         * @returns {Image} Returns a base64 image tag
         */
        getAvatar: function(fullsize) {
            if (fullsize)
                return "<img src='data:image/png;base64," + this.get('settings').avatar + "' />";
            return "<img src='data:image/png;base64," + this.get('settings').avatar + "' width='50' height='50' />";
        },
        /**
         * A quicker way to get a setting from the user settings object.
         * 
         * @method getSetting
         * @param {String} name
         * @return {Object}
         */
         getSetting: function(name) {
             return this.get('settings')[name];
         },
        /**
         * Returns an array of active study parts based on the current language being studied.
         * 
         * @method getStudyParts
         * @returns {Array}
         */
        getStudyParts: function() {
	    if (this.get('settings').targetLang === 'zh')
		return this.get('settings').chineseStudyParts;
	    return this.get('settings').japaneseStudyParts;
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
            Skritter.async.parallel([
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
        },
        /**
         * Performs a complete login, stores the authentication data and also fetches the users settings from the server.
         * If the statusCode returned is anything but 200 then it doesn't save, but returns the response message.
         * 
         * @method login
         * @param {String} username
         * @param {String} password
         * @param {Function} callback Returns the authentication response data
         */
        login: function(username, password, callback) {
            Skritter.api.authenticateUser(username, password, _.bind(function(response) {
                if (response.statusCode === 200) {
                    localStorage.setItem('activeUser', response.user_id);
                    Skritter.api.token = response.access_token;
                    this.set(response);
                    this.fetch(function() {
                        callback(response);
                    });
                } else {
                    callback(response);
                }
            }, this));
        },
        /**
         * Automatically logs the user out and returns them to the home screen when called.
         * 
         * @method logout
         */
        logout: function() {
            Skritter.facade.show('logging out');
            Skritter.storage.deleteDatabase(function() {
                localStorage.removeItem('activeUser');
                Skritter.application.reload(function() {
                    Skritter.facade.hide();
                    document.location.hash = '';
                });
            });
        },
        /**
         * A quicker way to set the user settings object.
         * 
         * @method setSetting
         * @param {String} name
         * @param {String} value
         * @return {Object}
         */
        setSetting: function(name, value) {
            var settings = this.get('settings');
            settings[name] = value;
            this.set('settings', settings);
            return this.get('settings');
        },
        /**
         * Syncs data with the server by getting changed items and posting reviews. If the account has never synced
         * this it initiates an full account download.
         * 
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            var accountDownload;
            var requests;
            var size = 0;
            if (this.get('lastSync')) {
                callback();
                requests = [
                    {
                        path: 'api/v0/items',
                        method: 'GET',
                        cache: false,
                        params: {
                            sort: 'changed',
                            offset: this.get('lastSync'),
                            include_vocabs: 'true',
                            include_strokes: 'true',
                            include_sentences: 'true',
                            include_heisigs: 'true',
                            include_top_mnemonics: 'true',
                            include_decomps: 'true'
                        },
                        spawner: true
                    }
                ];
            } else {
                Skritter.facade.show('initial download <br />');
                accountDownload = true;
                requests = [
                    {
                        path: 'api/v0/items',
                        method: 'GET',
                        cache: false,
                        params: {
                            sort: 'last',
                            include_vocabs: 'true',
                            include_strokes: 'true',
                            include_sentences: 'true',
                            include_heisigs: 'true',
                            include_top_mnemonics: 'true',
                            include_decomps: 'true'
                        },
                        spawner: true
                    }
                ];
            }
            Skritter.async.waterfall([
                function(callback) {
                    Skritter.study.srsconfigs.fetch(function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.api.requestBatch(requests, function(result) {
                        callback(null, result);
                    });
                },
                function(result, callback) {
                    Skritter.api.getBatch(result.id, function(result) {
                        size += result.responseSize;
                        if (accountDownload)
                            Skritter.facade.show('initial download <br />' + Skritter.fn.bytesToSize(size));
                        Skritter.study.decomps.add(result.Decomps);
                        Skritter.study.items.add(result.Items);
                        Skritter.study.srsconfigs.add(result.SRSConfigs);
                        Skritter.study.sentences.add(result.Sentences);
                        Skritter.study.strokes.add(result.Strokes);
                        Skritter.study.vocabs.add(result.Vocabs);
                    }, function() {
                        callback();
                    });
                },
                function(callback) {
                    Skritter.user.cacheAllData(function() {
                        callback();
                    });
                }
            ], function() {
                Skritter.user.set('lastSync', Skritter.fn.getUnixTime());
                if (accountDownload) {
                    Skritter.facade.hide();
                    if (typeof callback === 'function')
                        callback();
                }
            });
        },
        /**
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