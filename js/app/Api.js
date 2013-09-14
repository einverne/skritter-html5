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
    
    Api.prototype.getDateInfo = function(callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/dateinfo',
	    type: 'GET',
	    cache: false,
	    data: {
		bearer_token: Skritter.user.get('access_token')
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
	//var result = [];
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
		    var result = [];
		    var requests = batch.Requests;
		    
		    for (var i in requests)
		    {
			_.merge(result, requests[i].response, function(a, b) {
			    return _.isArray(a) ? a.concat(b) : undefined;
			});
		    }
		   
		    callback1(result);
		    
		    if (batch.runningRequests > 0 || requests.length > 0) {
			getBatchRequest(batchId);
		    } else {
			callback2();
		    }
		}
	    });
	};
	getBatchRequest(batchId);
    };
    
    Api.prototype.getItems = function(ids, callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/items',
	    type: 'GET',
	    cache: false,
	    data: {
		bearer_token: Skritter.user.get('access_token'),
		ids: ids.join('|'),
		include_vocabs: 'true'
	    },
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		callback(data);
	    }
	});
    };
    
    Api.prototype.getProgressStats = function(request, callback) {
	request['bearer_token'] = Skritter.user.get('access_token');
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/progstats',
	    type: 'GET',
	    cache: false,
	    data: request,
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		callback(data.ProgressStats);
	    }
	});
    };
    
    Api.prototype.getSimpTradMap = function(callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/simptradmap',
	    type: 'GET',
	    cache: false,
	    data: {
		bearer_token: Skritter.user.get('access_token')
	    },
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		callback(data);
	    }
	});
    };
    
    Api.prototype.getSRSConfigs = function(callback) {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/srsconfigs',
	    type: 'GET',
	    cache: false,
	    data: {
		bearer_token: Skritter.user.get('access_token')
	    },
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		callback(data.SRSConfigs);
	    }
	});
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
    
    Api.prototype.getVocabLists = function() {
	$.ajax({
	    url: Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/api/v0/vocablists',
	    type: 'GET',
	    cache: false,
	    data: {
		bearer_token: Skritter.user.get('access_token'),
		sort: 'official'
	    },
	    error: function(error) {
		callback(error);
	    },
	    success: function(data) {
		console.log(data.VocabLists);
		//callback(data.User);
	    }
	});
    };
    
    
    return Api;
});