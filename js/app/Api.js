define([
    'jquery'
], function() {
    var Skritter = window.skritter;
    
    var authenticateUser = function(username, password, callback) {
	$.ajax({
	    url: 'http://beta.skritter.' + Skritter.settings.get('apiDomain') + '/api/v0/oauth2/token',
	    type: 'POST',
	    data: {
		suppress_response_codes: true,
		grant_type: 'password',
		client_id: 'mcfarljwapiclient',
		username: username,
		password: password
	    },
	    error: function(error) {
		console.error(error);
		callback(error);
	    },
	    success: function(data) {
		callback(data);
	    }
	});
    };
    
    var requestBatch = function(requests, callback) {
	$.ajax({
	    url: 'http://beta.skritter.' + Skritter.settings.get('apiDomain') + '/api/v0/batch?bearer_token=' + Skritter.user.get('accessToken'),
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
    
    var getBatch = function(batchId, callback) {
	var result = [];
	
	var getBatchRequest = function(batchId) {
	    $.ajax({
		url: 'http://beta.skritter.' + Skritter.settings.get('apiDomain') + '/api/v0/batch/' + batchId,
		type: 'GET',
		cache: false,
		data: {
		    bearer_token: Skritter.user.get('accessToken')
		},
		error: function(error) {
		    console.error(error);
		},
		success: function(data) {
		    var batch = data.Batch;
		    console.log(batch);
		    var requests = batch.Requests;
		    
		    for (var i in requests)
		    {
			_.merge(result, requests[i].response, function(a, b) {
			    return _.isArray(a) ? a.concat(b) : undefined;
			});
		    }
		    
		    if (batch.runningRequests > 0 || requests.length > 0) {
			getBatchRequest(batchId);
		    } else {
			callback(result);
		    }
		}
	    });
	};
	
	getBatchRequest(batchId);
    };
    
    var getBatchStatus = function(batchId, callback) {
	$.ajax({
		url: 'http://beta.skritter.' + Skritter.settings.get('apiDomain') + '/api/v0/batch/' + batchId + '/status',
		type: 'GET',
		cache: false,
		data: {
		    bearer_token: Skritter.user.get('accessToken'),
		    detailed: true
		},
		error: function(error) {
		    console.error(error);
		    callback(error);
		},
		success: function(data) {
		    callback(data.Batch);
		}
	    });
    };

    return {
	authenticateUser: authenticateUser,
	requestBatch: requestBatch,
	getBatch: getBatch,
	getBatchStatus: getBatchStatus
    };
});