/*
 * 
 * Model: Manager
 * 
 * Created By: Joshua McFarland
 * 
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
    
    var Manager = Backbone.Model.extend({
	
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
	},
		
	downloadAccount: function(callback) {
	    Skritter.storage.clearAll(function() {
		console.log('starting account download');
		var requests = [
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
		    },
		    {
			path: 'api/v0/srsconfigs',
			method: 'GET',
			cache: false
		    }
		];
		
		Skritter.async.waterfall([
		    function(callback) {
			Skritter.api.requestBatch(requests, function(result) {
			    callback(null, result);
			});
		    },
		    function(result, callback) {
			Skritter.api.getBatch(result.id, function(result) {
			    callback(null, result);
			});
		    }
		], function(error, result) {
		    if (error) {
			callback(error);
			return;
		    }

		    Skritter.facade.show('SAVING DATA');
		    
		    Skritter.async.parallel({
			Decomps: function(callback) {
			    Skritter.storage.setItems('decomps', result.Decomps, function(event) {
				callback(null, event);
			    });
			},
			Items: function(callback) {
			    Skritter.storage.setItems('items', result.Items, function(event) {
				callback(null, event);
			    });
			},
			Sentences: function(callback) {
			    Skritter.storage.setItems('sentences', result.Sentences, function(event) {
				callback(null, event);
			    });
			},
			SRSConfigs: function(callback) {
			    Skritter.storage.setItems('srsconfigs', result.SRSConfigs, function(event) {
				callback(null, event);
			    });
			},
			Strokes: function(callback) {
			    Skritter.storage.setItems('strokes', result.Strokes, function(event) {
				callback(null, event);
			    });
			},
			Vocabs: function(callback) {
			    Skritter.storage.setItems('vocabs', result.Vocabs, function(event) {
				callback(null, event);
			    });
			}
		    }, function(error, result) {
			if (error) {
			    callback(error);
			    return;
			}
			console.log(result);
			callback(result);
		    });
		});
	    });
	},
	
	sync: function() {
	    var requests = [];
	    
	    if (Skritter.study.reviews.length > 0) {
		console.log('submitting reviews');
		var reviews = Skritter.study.reviews.toJSON();
		requests.push({
		    path: 'api/v0/reviews',
		    method: 'POST',
		    cache: false,
		    params: reviews
		});
		
		Skritter.api.requestBatch(requests, function(response) {
		    console.log('callback', response);
		});
	    }
	}
	
    });
    
    
    return Manager;
});