/*
 * 
 * Module: Api
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'base64',
    'jquery',
    'lodash'
], function() {
    
    function Api() {
	$.ajaxSetup({
	    beforeSend: function(xhr) {
		xhr.setRequestHeader('AUTHORIZATION', 'basic ' + Base64.encode(Skritter.settings.get('apiClientId') + ':' + Skritter.settings.get('apiClientSecret')));
	    }
	});
    }
    
    
    Api.prototype.authenticateUser = function(username, password, callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/oauth2/token',
	    type: 'POST',
	    data: {
		suppress_response_codes: true,
		grant_type: 'password',
		client_id: 'mcfarljwapiclient',
		username: username,
		password: password
	    },
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		callback(data);
	    }
	});
    };

    Api.prototype.requestBatch = function(requests, callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/batch?bearer_token=' + Skritter.user.get('access_token'),
	    type: 'POST',
	    data: JSON.stringify(requests),
	    error: function(error) {
		console.error(error);
		callback(error);
	    },
	    success: function(data) {
		callback(data.Batch);
	    }
	});
    };
    
    Api.prototype.getBatch = function(batchId, callback1, callback2) {
	var retryCount = 0;
	var result = [];
	var getBatchRequest = function(batchId) {
	    $.ajax({
		url: Skritter.settings.get('apiRoot') + '.'  + Skritter.settings.get('apiDomain') + '/api/v0/batch/' + batchId,
		type: 'GET',
		cache: false,
		data: {
		    bearer_token: Skritter.user.get('access_token')
		},
		error: function(error) {
		    if (retryCount < 5) {
			retryCount++;
			getBatchRequest(batchId);
		    } else {
			console.error(error);
		    }
		},
		success: function(data) {
		    retryCount = 0;
		    var batch = data.Batch;
		    console.log(batch);
		    var requests = batch.Requests;
		    
		    for (var i in requests)
		    {
			_.merge(result, requests[i].response, function(a, b) {
			    return _.isArray(a) ? a.concat(b) : undefined;
			});
		    }
		    
		    if (typeof callback2 === 'function') {
			callback2(requests);
		    }
		    
		    if (batch.runningRequests > 0 || requests.length > 0) {
			getBatchRequest(batchId);
		    } else {
			callback1(result);
		    }
		}
	    });
	};
	getBatchRequest(batchId);
    };
    
    Api.prototype.getUser = function(userId, callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/users/' + userId,
	    type: 'GET',
	    cache: false,
	    data: {
		bearer_token: Skritter.user.get('access_token'),
		detailed: true
	    },
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		callback(data.User);
	    }
	});
    };
    
    
    return Api;
});