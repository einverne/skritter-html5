/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method Api
     */
    var Api = Backbone.Model.extend({
        initialize: function() {
            Api.this = this;
            Api.clientId = 'mcfarljwapiclient';
            Api.clientSecret = 'e3872517fed90a820e441531548b8c';
            Api.root = 'https://www.skritter';
            Api.tld = document.location.host.indexOf('.cn') > -1 ? '.cn' : '.com';
            Api.base = Api.root + Api.tld + '/api/v' + this.get('version') + '/';
            Api.credentials = 'basic ' + Base64.encode(Api.clientId + ':' + Api.clientSecret);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            token: null,
            version: 0
        },
        /**
         * @method authenticateUser
         * @param {String} username
         * @param {String} password
         * @param {Function} callback
         */
        authenticateUser: function(username, password, callback) {
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'oauth2/token',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: {
                        suppress_response_codes: true,
                        grant_type: 'password',
                        client_id: Api.clientId,
                        username: username,
                        password: password
                    }
                });
                promise.done(function(data) {
                    callback(data);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * @method checkBatch
         * @param {String} batchId
         * @param {Boolean} detailed
         * @param {Function} callback
         */
        checkBatch: function(batchId, detailed, callback) {
            detailed = detailed ? detailed : false;
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'batch/' + batchId + '/status',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: Api.this.get('token'),
                        detailed: detailed
                    }
                });
                promise.done(function(data) {
                    callback(data.Batch);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        },
        /**
         * Merges the key results of two object arrays.
         * 
         * @method concatObjectArray
         * @param {Array} objectArray1
         * @param {Array} objectArray2
         * @returns {Array}
         */
        concatObjectArray: function(objectArray1, objectArray2) {
            return Array.isArray(objectArray1) ? objectArray1.concat(objectArray2) : undefined;
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
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'batch/' + batchId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: Api.this.get('token')
                    }
                });
                promise.done(function(data) {
                    var batch = data.Batch;
                    var requests = batch.Requests;
                    var responseSize = 0;
                    var result = {};
                    for (var i = 0, len = requests.length; i < len; i++)
                        if (requests[i].response) {
                            _.merge(result, requests[i].response, Api.this.concatObjectArray);
                            responseSize += requests[i].responseSize;
                        }
                    result.downloadedRequests = requests.length;
                    result.totalRequests = batch.totalRequests;
                    result.responseSize = responseSize;
                    result.runningRequests = batch.runningRequests;
                    if (batch.runningRequests > 0 || requests.length > 0) {
                        callback(result);
                    } else {
                        callback();
                    }
                });
                promise.fail(function(error) {
                });
            }
            request();
        },
        /**
         * @method getUser
         * @param {String} userId
         * @param {Function} callback
         */
        getUser: function(userId, callback) {
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'users/' + userId,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'GET',
                    data: {
                        bearer_token: Api.this.get('token'),
                        detailed: true
                    }
                });
                promise.done(function(data) {
                    callback(data.User);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
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
            function request() {
                var promise = $.ajax({
                    url: Api.base + 'batch?bearer_token=' + Api.this.get('token'),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('AUTHORIZATION', Api.credentials);
                    },
                    type: 'POST',
                    data: JSON.stringify(requests)
                });
                promise.done(function(data) {
                    callback(data.Batch);
                });
                promise.fail(function(error) {
                    callback(error);
                });
            }
            request();
        }
    });

    return Api;
});