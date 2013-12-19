/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'base64',
    'jquery',
    'lodash'
], function() {
    /**
     * Directly interfaces the official Skritter API with the application.
     * For documentation regarding the API user the following link:
     * http://beta.skritter.com/api/v0/docs
     * 
     * @class Api
     * @constructor
     */
    function Api() {
        this.batchId = null;
        this.clientId = 'mcfarljwapiclient';
        this.clientSecret = 'e3872517fed90a820e441531548b8c';
        this.credentials = 'basic ' + Base64.encode(this.clientId + ':' + this.clientSecret);
        this.domain = (document.location.host.indexOf('cn') > -1) ? 'cn' : 'com';
        this.root = 'https://beta.skritter';
        this.token = null;
        this.version = 0;
    }

    /**
     * Returns the authenticated user and the token required for future calls to the API.
     * 
     * @method authenticateUser
     * @param {String} username
     * @param {String} password
     * @param {Function} callback
     */
    Api.prototype.authenticateUser = function(username, password, callback) {
        var self = this;
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/oauth2/token',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
            },
            type: 'POST',
            data: {
                suppress_response_codes: true,
                grant_type: 'password',
                client_id: this.clientId,
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
    };

    /**
     * @method checkBatch
     * @param {Number} batchId
     * @param {Function} callback
     * @param {Boolean} detailed
     */
    Api.prototype.checkBatch = function(batchId, callback, detailed) {
        var self = this;
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/batch/' + batchId + '/status',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
            },
            type: 'GET',
            data: {
                bearer_token: this.token,
                detailed: detailed
            }
        });
        promise.done(function(data) {
            console.log(data.Batch);
            callback(data.Batch);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * @getBatch
     * @param {String} batchId
     * @param {Function} callback
     * @returns {undefined}
     */
    Api.prototype.getBatch = function(batchId, callback) {
        var self = this;
        var result = {};
        var responseSize = 0;
        var merge = function(a, b) {
            return Array.isArray(a) ? a.concat(b) : undefined;
        };
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/batch/' + batchId,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
            },
            type: 'GET',
            data: {
                bearer_token: self.token
            }
        });
        promise.done(function(data) {
            var batch = data.Batch;
            var requests = batch.Requests;
            for (var i in requests) {
                if (requests[i].response.statusCode === 200) {
                    _.merge(result, requests[i].response, merge);
                    responseSize += requests[i].responseSize;
                }
            }
            result.responseSize = responseSize;
            if (batch && (batch.runningRequests > 0 || requests.length > 0)) {
                callback(result);
            } else {
                callback();
            }
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * Returns an object with merged results based on a batch request. This is mainly used for
     * account downloads and for larger account can take a few minutes.
     * 
     * @method getBatchCombined
     * @param {Number} batchId
     * @param {Function} callback1
     * @param {Function} callback2
     */
    Api.prototype.getBatchCombined = function(batchId, callback1, callback2) {
        var self = this;
        var retryCount = 0;
        var responseSize = 0;
        var result = {};
        getNext();
        function getNext() {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/batch/' + batchId,
                type: 'GET',
                data: {
                    bearer_token: self.token
                }
            });
            promise.done(function(data) {
                var batch = data.Batch;
                var requests = batch.Requests;
                retryCount = 0;
                for (var i in requests) {
                    if (requests[i].response.statusCode === 200) {
                        _.merge(result, requests[i].response, merge);
                        responseSize += requests[i].responseSize;
                    }
                }
                if (typeof callback1 === 'function')
                    callback1(responseSize);
                if (batch && (batch.runningRequests > 0 || requests.length > 0)) {
                    window.setTimeout(function() {
                        getNext(batchId);
                    }, 2000);
                } else {
                    result.responseSize = responseSize;
                    callback2(result);
                }
            });
            promise.fail(function(error) {
                if (retryCount < 5) {
                    retryCount++;
                    setTimeout(function() {
                        getBatchRequest(batchId);
                    }, 5000);
                } else {
                    console.error(error);
                }
            });
        }
        function merge(a, b) {
            return Array.isArray(a) ? a.concat(b) : undefined;
        }
    };

    /**
     * Returns the official date information of the account from the server. This is the safest way
     * to check the current time associated with the account.
     * 
     * @method getDateInfo
     * @param {Function} callback
     */
    Api.prototype.getDateInfo = function(callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/dateinfo',
            type: 'GET',
            data: {
                bearer_token: this.token
            }
        });
        promise.done(function(data) {
            callback(data);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * @method getItemsById
     * @param {Array} ids
     * @param {Function} callback
     */
    Api.prototype.getItemsById = function(ids, callback) {
        var self = this;
        var requests = [
            {
                path: 'api/v' + this.version + '/items',
                method: 'GET',
                params: {
                    bearer_token: self.token,
                    ids: ids.join('|'),
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
        skritter.async.waterfall([
            //request the minimal fields from items and vocabs
            function(callback) {
                self.requestBatch(requests, function(batch) {
                    callback(null, batch);
                });
            },
            //waits for the batch to complete and updates the size
            function(batch, callback) {
                self.getBatchCombined(batch.id, function(size) {
                    if (skritter.fn.bytesToSize(size))
                        console.log(skritter.fn.bytesToSize(size));
                }, callback);
            }
        ], function(result) {
            callback(result);
        });
    };

    /**
     * @method getItemsNext
     * @param {Number} limit
     * @param {Function} callback
     */
    Api.prototype.getItemsNext = function(limit, callback) {
        var self = this;
        var results = [];
        next();
        function next(cursor) {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/items',
                type: 'GET',
                data: {
                    bearer_token: self.token,
                    limit: 30,
                    sort: 'next',
                    cursor: cursor,
                    include_vocabs: 'true',
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
                }
            });
            promise.done(function(data) {
                console.log(data);
                _.merge(results, data, merge);
                if (results.Items.length < limit && data.cursor) {
                    next(data.cursor);
                } else {
                    callback(results);
                }
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        }
        function merge(a, b) {
            return Array.isArray(a) ? a.concat(b) : undefined;
        }
    };

    /**
     * @method getItemsCondensed
     * @param {Function} callback
     * @param {Number} offset
     */
    Api.prototype.getItemsCondensed = function(callback, offset) {
        var self = this;
        offset = (offset) ? offset : 0;
        var requests = [
            {
                path: 'api/v' + self.version + '/items',
                method: 'GET',
                params: {
                    sort: 'changed',
                    offset: offset,
                    fields: 'id,changed,last,next,vocabIds',
                    include_vocabs: 'true',
                    vocab_fields: 'id,containedVocabIds'
                },
                spawner: true
            },
            {
                path: 'api/v' + self.version + '/srsconfigs',
                method: 'GET',
                params: {
                    bearer_token: self.token
                }
            }
        ];
        skritter.async.waterfall([
            //request the minimal fields from items and vocabs
            function(callback) {
                self.requestBatch(requests, function(batch) {
                    callback(null, batch);
                });
            },
            //waits for the batch to complete and updates the size
            function(batch, callback) {
                self.getBatchCombined(batch.id, null, function(result) {
                    callback(null, result);
                });
            },
            //condenses the contained ids into the items entity
            function(result, callback) {
                for (var i in result.Items)
                    //filter out items that don't need contained ids
                    if ((result.Items[i].id.indexOf('rune') !== -1 || result.Items[i].id.indexOf('tone') !== -1) && result.Items[i].vocabIds.length > 1) {
                        //TODO: really needs a web worker to handle this without bogging down the dom
                        var containedVocabIds = _.find(result.Vocabs, {id: result.Items[i].vocabIds[0]}).containedVocabIds;
                        if (containedVocabIds)
                            result.Items[i].containedVocabIds = containedVocabIds;
                    }
                delete result.cursor;
                delete result.Vocabs;
                callback(result);
            }
        ], function(result) {
            callback(result);
        });
    };

    /**
     * Returns specific progress stats that can be used for various things such as an actual
     * progress page or study time for the day from the server. To read more about the request parameters
     * check the API documentation.
     * 
     * @method getProgressStats
     * @param {Object} request
     * @param {Function} callback
     */
    Api.prototype.getProgressStats = function(request, callback) {
        request.bearer_token = this.token;
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/progstats',
            type: 'GET',
            data: request
        });
        promise.done(function(data) {
            callback(data.ProgressStats);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * Returns an array of review post errors from the server. If the offset is null then
     * it'll return all of the review errors.
     * 
     * @method getReviewErrors
     * @param {Number} offset
     * @param {Function} callback
     */
    Api.prototype.getReviewErrors = function(offset, callback) {
        var self = this;
        var errors = [];
        var getNext = function(cursor) {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/reviews/errors',
                type: 'GET',
                data: {
                    bearer_token: self.token,
                    cursor: cursor,
                    offset: offset
                }
            });
            promise.done(function(data) {
                errors = errors.concat(data.ReviewErrors);
                if (data.cursor) {
                    setTimeout(function() {
                        getNext(data.cursor);
                    }, 1000);
                } else {
                    callback(errors);
                }
            });
            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        };
        getNext();
    };
    
    /**
     * Returns the SRSConfig values for the current active user. These should be updated
     * somewhat frequently to keep SRS calculations accurate.
     * 
     * @method getSRSConfigs
     * @param {Function} callback
     */
    Api.prototype.getSRSConfigs = function(callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/srsconfigs',
            type: 'GET',
            data: {
                bearer_token: this.token
            }
        });
        promise.done(function(data) {
            callback(data.SRSConfigs);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };
    
    /**
     * Returns basic informatiom about a user or detailed information if its a request
     * for the current active user.
     * 
     * @method getUser
     * @param {Number} userId description
     * @param {Function} callback description
     */
    Api.prototype.getUser = function(userId, callback) {
        var self = this;
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/users/' + userId,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
            },
            type: 'GET',
            data: {
                bearer_token: this.token,
                detailed: true
            }
        });
        promise.done(function(data) {
            callback(data.User);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * Returns a single vocablist with section ids for further querying.
     * 
     * @method getVocabList
     * @param {Number} id
     * @param {Function} callback
     */
    Api.prototype.getVocabList = function(id, callback) {
        var self = this;
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/vocablists/' + id,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
            },
            type: 'GET',
            data: {
                bearer_token: this.token
            }
        });
        promise.done(function(data) {
            callback(data.VocabList);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * Returns a high level list of lists available sorted by type. For longer sort groups
     * it might be necessary to use pagination.
     * 
     * @method getVocabLists
     * @param {String} sort
     * @param {Function} callback
     */
    Api.prototype.getVocabLists = function(sort, callback) {
        var self = this;
        var lists = [];
        var getNext = function(cursor) {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/vocablists',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                },
                type: 'GET',
                data: {
                    bearer_token: self.token,
                    sort: sort,
                    cursor: cursor
                }
            });
            promise.done(function(data) {
                lists = lists.concat(data.VocabLists);
                if (data.cursor) {
                    setTimeout(function() {
                        getNext(data.cursor);
                    }, 2000);
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
    };

    /**
     * Posts batches of reviews in groups of 500 and then returns an array of the posted objects.
     * 
     * @method postReviews
     * @param {Array} reviews
     * @param {Function} callback
     */
    Api.prototype.postReviews = function(reviews, callback) {
        var self = this;
        var postedReviews = [];
        var postBatch = function(batch) {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/reviews?bearer_token=' + self.token,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('AUTHORIZATION', self.credentials);
                },
                type: 'POST',
                data: JSON.stringify(batch)
            });
            promise.done(function(data) {
                postedReviews = postedReviews.concat(batch);
                if (reviews.length > 0) {
                    postBatch(reviews.splice(0, 499));
                } else {
                    callback(postedReviews, data);
                }
            });
            promise.fail(function(error) {
                console.error(error);
                callback();
            });
        };
        postBatch(reviews.splice(0, 499));
    };

    /**
     * Requests a specific batch from the server and returns the request id. Use the
     * getBatch function to get the requested data from the server.
     * 
     * @method requestBatch
     * @param {Array} requests
     * @param {Function} callback
     */
    Api.prototype.requestBatch = function(requests, callback) {
        var self = this;
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/batch?bearer_token=' + this.token,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', self.credentials);
            },
            type: 'POST',
            data: JSON.stringify(requests)
        });
        promise.done(function(data) {
            self.batchId = data.Batch.id;
            callback(data.Batch);
        });
        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    return Api;
});