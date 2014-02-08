/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method Api
     */
    var Api = Backbone.Model.extend({
        defaults: {
            clientId: 'mcfarljwapiclient',
            clientSecret: 'e3872517fed90a820e441531548b8c',
            domain: (document.location.host.indexOf('cn') > -1) ? 'cn' : 'com',
            root: 'https://www.skritter',
            token: null,
            version: 0
        },
        /**
         * @method authenticateGuest
         */
        authenticateGuest: function() {
            var self = this;
            var guest = JSON.parse(localStorage.getItem('guest'));
            if (guest) {
                this.token = guest.access_token;
                callback();
            } else {
                var promise = $.ajax({
                    url: self.baseUrl() + 'oauth2/token',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'POST',
                    data: {
                        suppress_response_codes: true,
                        grant_type: 'client_credentials',
                        client_id: this.get('clientId')
                    }
                });
                promise.done(function(data) {
                    self.token = data.access_token;
                    localStorage.setItem('guest', JSON.stringify(data));
                    callback();
                });
                promise.fail(function(error) {
                    console.error(error);
                    callback(error);
                });
            }
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + 'oauth2/token',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'POST',
                data: {
                    suppress_response_codes: true,
                    grant_type: 'password',
                    client_id: self.get('clientId'),
                    username: username,
                    password: password
                }
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        baseUrl: function() {
            return this.get('root') + '.' + this.get('domain') + '/api/v' + this.get('version') + '/';
        },
        credentials: function() {
            return 'basic ' + Base64.encode(this.get('clientId') + ':' + this.get('clientSecret'));
        },
        /**
         * Using repeated calls it returns the data from a batch request of a given batch id. It works
         * best if the data is stored to the database before getting the next batch otherwise it could
         * cause mobile browsers to crash.
         * 
         * @method getBatch
         * @param {Number} batchId
         * @param {Function} callback
         */
        getBatch: function(batchId, callback) {
            var self = this;
            var retryCount = 0;
            var getBatch = function() {
                var promise = $.ajax({
                    url: self.baseUrl() + 'batch/' + batchId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token')
                    }
                });
                promise.done(function(data) {
                    try {
                        var batch = data.Batch;
                        var requests = batch.Requests;
                        var responseSize = 0;
                        var result = {};
                        for (var i in requests) {
                            if (requests[i].response) {
                                _.merge(result, requests[i].response, skritter.fn.concatObjectArray);
                                responseSize += requests[i].responseSize;
                            }
                        }
                        result.responseSize = responseSize;
                        if (batch && (batch.runningRequests > 0 || requests.length > 0)) {
                            callback(result);
                        } else {
                            callback();
                        }
                    } catch (error) {
                        console.error(error);
                        window.setTimeout(function() {
                            getBatch();
                        }, 2000);
                    }
                });
                promise.fail(function(error) {
                    retryCount++;
                    if (retryCount > 3) {
                        console.error(error);
                        callback(error);
                    } else {
                        window.setTimeout(function() {
                            getBatch();
                        }, 2000);
                    }
                });
            };
            getBatch();
        },
        /**
         * Returns a single vocablist with section ids for further querying.
         * 
         * @method getVocabList
         * @param {Number} id
         * @param {Function} callback
         */
        getVocabList: function(id, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + '/vocablists/' + id,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'GET',
                data: {
                    bearer_token: self.get('token')
                }
            });
            promise.done(function(data) {
                callback(data.VocabList);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * @method getVocabListSection
         * @param {String} listId
         * @param {String} sectionId
         * @param {Function} callback
         */
        getVocabListSection: function(listId, sectionId, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + '/vocablists/' + listId + '/sections/' + sectionId,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'GET',
                data: {
                    bearer_token: self.get('token')
                }
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * Returns a high level list of lists available sorted by type. For longer sort groups
         * it might be necessary to use pagination. Sort values include: published, custom,
         * official and studying.
         * 
         * @method getVocabLists
         * @param {String} sort
         * @param {String} fields
         * @param {Function} callback
         */
        getVocabLists: function(sort, fields, callback) {
            var self = this;
            var lists = [];
            fields = (fields) ? fields : undefined;
            var getNext = function(cursor) {
                var promise = $.ajax({
                    url: self.baseUrl() + 'vocablists',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        sort: sort,
                        cursor: cursor,
                        fields: fields
                    }
                });
                promise.done(function(data) {
                    lists = lists.concat(data.VocabLists);
                    if (data.cursor) {
                        setTimeout(function() {
                            getNext(data.cursor);
                        }, 500);
                    } else {
                        callback(lists, data.cursor);
                    }
                });
                promise.fail(function(error) {
                    console.error(error);
                    callback(error);
                });
            };
            getNext();
        },
        /**
         * @method getVocabs
         * @param {Array} ids
         * @param {Function} callback
         */
        getVocabs: function(ids, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + '/vocabs',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'GET',
                data: {
                    bearer_token: self.get('token'),
                    ids: ids.join('|'),
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
                }
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * @method getUser
         * @param {String} userId
         * @param {Function} callback
         */
        getUser: function(userId, callback) {
            var self = this;
            var tryCount = 0;
            request();
            function request() {
                var promise = $.ajax({
                    url: self.baseUrl() + 'users/' + userId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'GET',
                    data: {
                        bearer_token: self.get('token'),
                        detailed: true
                    }
                });
                promise.done(function(data) {
                    callback(data.User);
                });
                promise.fail(function(error) {
                    console.error(error);
                    if (tryCount > 2) {
                        callback(error);
                    } else {
                        tryCount++;
                        skritter.log.console('RETRYING TO GET USER');
                        setTimeout(function() {
                            request();
                        }, 1000);
                    }
                });
            }
        },
        /**
         * Posts batches of reviews in groups of 500 and then returns an array of the posted objects.
         * 
         * @method postReviews
         * @param {Array} reviews
         * @param {Function} callback
         */
        postReviews: function(reviews, callback) {
            var self = this;
            var postedReviews = [];
            var postBatch = function(batch) {
                var promise = $.ajax({
                    url: self.baseUrl() + 'reviews?bearer_token=' + self.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                    },
                    type: 'POST',
                    data: JSON.stringify(batch)
                });
                promise.done(function() {
                    postedReviews = postedReviews.concat(batch);
                    if (reviews.length > 0) {
                        postBatch(reviews.splice(0, 499));
                    } else {
                        callback(postedReviews);
                    }
                });
                promise.fail(function(error) {
                    console.error(error);
                    callback(postedReviews);
                });
            };
            postBatch(reviews.splice(0, 499));
        },
        /**
         * Requests a specific batch from the server and returns the request id. Use the
         * getBatch function to get the requested data from the server.
         * 
         * @method requestBatch
         * @param {Array} requests
         * @param {Function} callback
         */
        requestBatch: function(requests, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + 'batch?bearer_token=' + this.get('token'),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'POST',
                data: JSON.stringify(requests)
            });
            promise.done(function(data) {
                callback(data.Batch);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        },
        /**
         * @method updateVocabList
         * @param {Object} list
         * @param {Function} callback
         */
        updateVocabList: function(list, callback) {
            var self = this;
            var promise = $.ajax({
                url: self.baseUrl() + 'vocablists/' + list.id + '?bearer_token=' + self.get('token'),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials());
                },
                type: 'PUT',
                data: JSON.stringify(list)
            });
            promise.done(function(data) {
                callback(data);
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        }
    });

    return Api;
});