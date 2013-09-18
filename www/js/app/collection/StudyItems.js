/*
 * 
 * Collection: StudyItems
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyItem',
    'backbone'
], function(StudyItem) {
    
    var StudyItems = Backbone.Collection.extend({
	
	model: StudyItem,
		
	cache: function(callback) {
	    if (this.length === 0) {
		callback();
		return;
	    }
	    Skritter.storage.setItems('items', this.toJSON(), function() {
		if (typeof callback === 'function')
		    callback();
	    });
	},
		
	comparator: function(item) {
	    return -item.getReadiness();
	},
		
	fetch: function(offset, callback) {
	    var requests = [
		{
		    path: 'api/v0/items',
		    method: 'GET',
		    cache: false,
		    params: {
			sort: (offset) ? 'changed' : 'last',
			offset: (offset) ? offset : '',
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

	    Skritter.async.waterfall([
		function(callback) {
		    Skritter.api.requestBatch(requests, function(result) {
			    callback(null, result);
		    });
		},
		function(result, callback) {
		    Skritter.api.getBatch(result.id, function(result) {
			console.log(result);
			Skritter.study.decomps.add(result.Decomps);
			Skritter.study.items.add(result.Items);
			Skritter.study.srsconfigs.add(result.SRSConfigs);
			Skritter.study.sentences.add(result.Sentences);
			Skritter.study.strokes.add(result.Strokes);
			Skritter.study.vocabs.add(result.Vocabs);
		    }, function() {
			callback();
		    });
		}
	    ], function() {
		callback();
	    });
	},
		
	loadAll: function(callback) {
	    Skritter.storage.getItems('items', function(items) {
		console.log('loading items');
		Skritter.study.items.add(items);
		callback(null, items);
	    });
	},
	
	filterActive: function() {
	    var filtered = this.filter(function(items) {
		if (items.get('vocabIds').length > 0)
		    return true;
	    });
	    return new StudyItems(filtered);
	},
		
	filterBy: function(attribute, value) {
	    var filtered = this.filter(function(items) {
		return _.contains(value, items.get(attribute));
	    });
	    return new StudyItems(filtered);
	},
		
	getContainedItemIds: function() {
	    var items = [];
	    for (var a in this.models) {
		var item = this.models[a];
		var vocabs = item.getVocabs();
		for (var b in vocabs)
		{
		    var contained = vocabs[b].get('containedVocabIds');
		    for (var c in contained) {
			var id = Skritter.user.get('id') + '-' + contained[c] + '-' + item.get('part');
			if (!_.contains(items, id)) {
			    items.push(id);
			}
		    }
		}
	    }
	    return items;
	},
		
	getNext: function(callback) {
	    var item = this.at(0);
	    callback(item);
	},
	
	getStudy: function() {
	    var items = this.filterActive();
	    return items.filterBy('part', Skritter.user.getStudyParts());
	},
		
	getReadyCount: function() {
	    var count = 0;
	    for (var i in this.models)
	    {
		var item = this.models[i];
		console.log(item.get('id'), item.getReadiness());
		if (item.isActive() && item.getReadiness() >= 1)
		    count++;
	    }
	    return count;
	}
	
    });
    
    
    return StudyItems;
});