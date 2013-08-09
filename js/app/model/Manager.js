/*
 * 
 * Module: Manager
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Api',
    'Params',
    'collection/StudyDecomps',
    'collection/StudyItems',
    'collection/StudyParams',
    'collection/StudyReviews',
    'collection/StudySRSConfigs',
    'collection/StudySentences',
    'collection/StudyStrokes',
    'collection/StudyVocabs',
    'async',
    'base64',
    'backbone'
], function(Api, Params, StudyDecomps, StudyItems, StudyParams, StudyReviews, StudySRSConfigs, StudySentences, StudyStrokes, StudyVocabs, Async) {
    var Skritter = window.skritter;
    
    var Manager = Backbone.Model.extend({
	
	initialize: function() {
	    //required for all external ajax calls to the skritter api
	    $.ajaxSetup({
		beforeSend: function(xhr) {
		    xhr.setRequestHeader('AUTHORIZATION', 'basic ' + Base64.encode(Skritter.settings.get('apiClientId') + ':' + Skritter.settings.get('apiClientSecret')));
		}
	    });
	    
	    //create all of the collections required for storing study information
	    Skritter.studyDecomps = new StudyDecomps();
	    Skritter.studyItems = new StudyItems();
	    Skritter.studyParams = new StudyParams().add(Params.json);
	    Skritter.studyReviews = new StudyReviews();
	    Skritter.studySRSConfigs = new StudySRSConfigs();
	    Skritter.studySentences = new StudySentences();
	    Skritter.studyStrokes = new StudyStrokes();
	    Skritter.studyVocabs = new StudyVocabs();
	},
	
	
	sync: function(callback) {
	    //no syncing if the user is not logged in
	    if (!Skritter.user.isLoggedIn()) {
		callback();
		return;
	    }

	    //returns items changed since last sync
	    if (Skritter.user.get('lastSync') && Skritter.storage.type !== 'localstorage') {
		Skritter.manager.syncIncremental(callback);
		return;
	    }

	    //returns next 30 review items
	    Skritter.manager.syncMinimal(callback);
	},
	
	syncFull: function(callback) {
	    var self = this;
	    //handles users initial sync and account download
	    if (!Skritter.user.get('lastSync') && Skritter.storage.type !== 'localstorage') {
		this.fromServer({
		    srsconfigs: true
		}, function(result) {
		    self.setStudyData(result);
		    self.toCache(result, function(result) {
			console.log(result);
			Skritter.user.set('lastSync', Skritter.fn.getUnixTime());
			callback(result);
		    });
		});
		return;
	    }
	},
	
	syncIncremental: function(callback) {
	    var self = this;
	    //handles a partial sync to keep data up to date
	    if (Skritter.user.get('lastSync') && Skritter.storage.type !== 'localstorage') {
		Skritter.facade.show('SYNCING');
		this.fromServer({
		    srsconfigs: true,
		    sort: 'changed',
		    offset: Skritter.user.get('lastSync')
		}, function(result) {
		    self.setStudyData(result);
		    self.toCache(result, function(result) {
			console.log(result);
			Skritter.user.set('lastSync', Skritter.fn.getUnixTime());
			callback(result);
		    });
		});
		return;
	    }
	},
	
	syncMinimal: function(callback) {
	    var self = this;
	    //defaults back to flash style loading
	    this.fromServer({
		srsconfigs: true,
		sort: 'next',
		limit: 30
	    }, function(result) {
		self.setStudyData(result);
		self.toCache(result, function(result) {
		    console.log(result);
		    callback(result);
		});
	    });
	},
	
	fromCache: function(callback) {
	    Async.parallel({
		Decomps: function(callback) {
		    Skritter.storage.getItems('decomps', function(event) {
			callback(null, event);
		    });
		},
		Items: function(callback) {
		    Skritter.storage.getItems('items', function(event) {
			callback(null, event);
		    });
		},
		Sentences: function(callback) {
		    Skritter.storage.getItems('sentences', function(event) {
			callback(null, event);
		    });
		},
		SRSConfigs: function(callback) {
		    Skritter.storage.getItems('srsconfigs', function(event) {
			callback(null, event);
		    });
		},
		Strokes: function(callback) {
		    Skritter.storage.getItems('strokes', function(event) {
			callback(null, event);
		    });
		},
		Vocabs: function(callback) {
		    Skritter.storage.getItems('vocabs', function(event) {
			callback(null, event);
		    });
		}
	    }, function(error, result) {
		if (error) {
		    callback(error);
		    return;
		}
		callback(result);
	    });
	},
	
	fromServer: function(options, callback) {
	    
	    var requests = [{
		    path: 'api/v0/items',
		    method: 'GET',
		    cache: false,
		    params: {
			sort: options.sort,
			limit: options.limit,
			offset: options.offset,
			include_vocabs: 'true',
			include_strokes: 'true',
			include_sentences: 'true',
			include_heisigs: 'true',
			include_top_mnemonics: 'true',
			include_decomps: 'true'
		    },
		    spawner: (options.limit) ? false : true
		}];
	    
	    if (options.srsconfigs) {
		requests.push({
		    path: 'api/v0/srsconfigs',
		    method: 'GET',
		    cache: false
		});
	    }
	    
	    Async.waterfall([
		function(callback) {
		    Api.requestBatch(requests, function(result) {
			callback(null, result);
		    });
		},
		function(result, callback) {
		    Api.getBatch(result.id, function(result) {
			callback(null, result);
		    });
		}
	    ], function(error, result) {
		if (error) {
		    callback(error);
		    return;
		}
		callback(result);
	    });
	},
	
	login: function(username, password, callback) {
	    Api.authenticateUser(username, password, function(data) {
		if (data.statusCode !== 200) {
		    console.error(data);
		}
		callback(data);
	    });
	},
	
	setStudyData: function(data) {
	    Skritter.studyDecomps.add(data.Decomps);
	    Skritter.studyItems.add(data.Items);
	    Skritter.studySentences.add(data.Sentences);
	    Skritter.studySRSConfigs.add(data.SRSConfigs);
	    Skritter.studyStrokes.add(data.Strokes);
	    Skritter.studyVocabs.add(data.Vocabs);
	},
		
	toCache: function(data, callback) {
	    Async.parallel({
		Decomps: function(callback) {
		    Skritter.storage.setItems('decomps', data.Decomps, function(event) {
			callback(null, event);
		    });
		},
		Items: function(callback) {
		    Skritter.storage.setItems('items', data.Items, function(event) {
			callback(null, event);
		    });
		},
		Sentences: function(callback) {
		    Skritter.storage.setItems('sentences', data.Sentences, function(event) {
			callback(null, event);
		    });
		},
		SRSConfigs: function(callback) {
		    Skritter.storage.setItems('srsconfigs', data.SRSConfigs, function(event) {
			callback(null, event);
		    });
		},
		Strokes: function(callback) {
		    Skritter.storage.setItems('strokes', data.Strokes, function(event) {
			callback(null, event);
		    });
		},
		Vocabs: function(callback) {
		    Skritter.storage.setItems('vocabs', data.Vocabs, function(event) {
			callback(null, event);
		    });
		}
	    }, function(error, result) {
		if (error) {
		    callback(error);
		    return;
		}
		callback(result);
	    });
	}
	
    });
    
    return Manager;
});