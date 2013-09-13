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
		
	comparator: function(item) {
	    return -item.getReadiness();
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