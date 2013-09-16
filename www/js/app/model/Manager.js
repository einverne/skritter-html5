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
		
	cacheAll: function(callback) {
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
		
	downloadAccount: function(callback) {
	    var self = this;
	    Skritter.storage.clearAll(function() {
		Skritter.facade.show('DOWNLOADING ACCOUNT');
		Skritter.async.series([
		    function(callback) {
			Skritter.study.srsconfigs.fetch(function() {
			    callback();
			});
		    },
		    function(callback) {
			Skritter.study.items.fetch(null, function() {
			    callback();
			}, null);
		    }
		], function() {
		    Skritter.facade.show('SAVING DATA');
		    self.cacheAll(function() {
			Skritter.user.set('lastSync', Skritter.fn.getUnixTime());
			callback();
		    });
		});
	    });
	},
	
	sync: function(callback) {
	    console.log('syncing');
	    Skritter.study.items.fetch(Skritter.user.get('lastSync'), function() {
		Skritter.user.set('lastSync', Skritter.fn.getUnixTime());
		callback();
	    });
	}
	
    });
    
    
    return Manager;
});