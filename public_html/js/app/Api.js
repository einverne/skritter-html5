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
     * @param {String} clientId description
     * @param {String} clientSecret description
     * @constructor
     */
    function Api(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.domain = null;
        this.root = null;
        this.token = null;
        this.version = null;
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('AUTHORIZATION', 'basic ' + Base64.encode(clientId + ':' + clientSecret));
            }
        });
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
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/oauth2/token',
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
            cache: false,
            data: {
                bearer_token: Skritter.user.get('access_token')
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
     * Requests a specific batch from the server and returns the request id. Use the
     * getBatch function to get the requested data from the server.
     * 
     * @method requestBatch
     * @param {Array} requests
     * @param {Function} callback
     */
    Api.prototype.requestBatch = function(requests, callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/batch?bearer_token=' + this.token,
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
    };

    /**
     * Returns an object with merged results based on a batch request. This is mainly used for
     * account downloads and for larger account can take a few minutes.
     * 
     * @method getBatch
     * @param {Number} batchId
     * @param {Function} callback1
     * @param {Function} callback2
     */
    Api.prototype.getBatch = function(batchId, callback1, callback2) {
        var self = this;
        var retryCount = 0;
        var getBatchRequest = function(batchId) {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/batch/' + batchId,
                type: 'GET',
                cache: false,
                data: {
                    bearer_token: self.token
                }
            });

            promise.done(function(data) {
                retryCount = 0;
                var batch = data.Batch;
                var result = [];
                var requests = batch.Requests;

                for (var i in requests) {
                    _.merge(result, requests[i].response, function(a, b) {
                        return _.isArray(a) ? a.concat(b) : undefined;
                    });
                }

                var responseSize = 0;
                for (var r in requests) {
                    responseSize += requests[r].responseSize;
                }

                result.responseSize = responseSize;
                callback1(result);

                if (batch.runningRequests > 0 || requests.length > 0) {
                    setTimeout(function() {
                        getBatchRequest(batchId);
                    }, 2000);
                } else {
                    callback2();
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
        };

        getBatchRequest(batchId);
    };

    /**
     * Returns an array of items and information relating to them.
     * 
     * @method getItems
     * @param {Array} ids description
     * @param {Function} callback description
     */
    Api.prototype.getItems = function(ids, callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/items',
            type: 'GET',
            cache: false,
            data: {
                bearer_token: this.token,
                ids: ids.join('|'),
                include_vocabs: 'true'
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
     * Returns specific progress stats that can be used for various things such as an actual
     * progress page or study time for the day from the server. To read more about the request parameters
     * check the API documentation.
     * 
     * @method getProgressStats
     * @param {Object} request
     * @param {Function} callback
     */
    Api.prototype.getProgressStats = function(request, callback) {
        request.bearer_token = Skritter.user.get('access_token');
        var promise = $.ajax({
            url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/progstats',
            type: 'GET',
            cache: false,
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
                cache: false,
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
                    }, 2000);
                } else {
                    console.log(errors);
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
     * Returns an object containing character mappings from simplified to traditional Chinese.
     * Right now this is locally packaged with the application as it's not often updated.
     * 
     * @method getSimpTradMap
     * @param {Function} callback
     */
    Api.prototype.getSimpTradMap = function(callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/simptradmap',
            type: 'GET',
            cache: false,
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
            cache: false,
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
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/users/' + userId,
            type: 'GET',
            cache: false,
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
     * Returns a high level list of lists available sorted by type. For longer sort groups
     * it might be nessesary to use pagination.
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
                type: 'GET',
                cache: false,
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
     * Returns a single vocablist with section ids for further querying.
     * 
     * @method getVocabList
     * @param {Number} id
     * @param {Function} callback
     */
    Api.prototype.getVocabList = function(id, callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/vocablists/' + id,
            type: 'GET',
            cache: false,
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
     * Returns an array of rows in s single list section.
     * 
     * @method getVocabListSection
     * @param {String} listId
     * @param {String} sectionId
     * @param {Function} callback
     */
    Api.prototype.getVocabListSection = function(listId, sectionId, callback) {
        var promise = $.ajax({
            url: this.root + '.' + this.domain + '/api/v' + this.version + '/vocablists/' + listId + '/sections/' + sectionId,
            type: 'GET',
            cache: false,
            data: {
                bearer_token: this.token
            }
        });

        promise.done(function(data) {
            callback(data.VocabListSection);
        });

        promise.fail(function(error) {
            console.error(error);
            callback(error);
        });
    };

    /**
     * Posts batches of reviews in groups of 500 and then returns an array of the posted objects.
     * 
     * @method postReviews
     * @param {Array} reviews
     * @param {Date} date
     * @param {Function} callback
     */
    Api.prototype.postReviews = function(reviews, date, callback) {
        var self = this;
        var postedReviews = [];
        var postNext = function(batch) {
            var promise = $.ajax({
                url: self.root + '.' + self.domain + '/api/v' + self.version + '/reviews?bearer_token=' + self.token + '&date=' + date,
                type: 'POST',
                cache: false,
                data: JSON.stringify(batch)
            });

            promise.done(function(data) {
                postedReviews = postedReviews.concat(batch);
                if (reviews.length > 0) {
                    postNext(reviews.splice(0, 499));
                } else {
                    callback(postedReviews, data);
                }
            });

            promise.fail(function(error) {
                console.error(error);
                callback(error);
            });
        };
        
        postNext(reviews.splice(0, 499));
    };


    return Api;
});