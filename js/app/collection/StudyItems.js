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
    var Skritter = window.skritter;
    
    var StudyItems = Backbone.Collection.extend({
	
	initialize: function() {
	    this.on('change:interval', this.sort);
	},
	
	model: StudyItem,
		
	comparator: function(item) {
	    return -item.getReadiness();
	},
	
	//returns items that contain a vocabIds
	//some items are added but not actively being studied
	filterActive: function() {
	    filtered = this.filter(function(items) {
		if (items.get('vocabIds').length > 0)
		    return true;
	    });
	    return new StudyItems(filtered);
	},
		
	//returns the collection if the attribute contains one of the values
	filterBy: function(attribute, value) {
	    filtered = this.filter(function(items) {
		return _.contains(value, items.get(attribute));
	    });
	    return new StudyItems(filtered);
	}
	
    });
    
    return StudyItems;
});