/*
 * 
 * Collection: CanvasCharacter
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/CanvasStroke',
    'backbone'
], function(CanvasStroke) {
    
    var CanvasCharacter = Backbone.Collection.extend({
	
	model: CanvasStroke,
		
	containsStroke: function(stroke) {
	    var strokeId = stroke.get('id');
	    var strokeContains = stroke.getContainedStrokeIds();
	    for (var i in this.models)
	    {
		var id = this.models[i].get('id');
		var contains = this.models[i].getContainedStrokeIds();
		//directly check for strokes position
		if (strokeId === id) {
		    return true;
		}
		//checks for existing contained strokes
		if (contains) {
		    for (var i in contains)
		    {
			var contained = contains[i];
			if (_.contains(strokeContains, contained)) {
			    return true;
			}
		    }
		}
	    }
	    return false;
	},
		
	getCharacterBitmap: function() {
	    var bitmapContainer = new createjs.Container();
	    for (var i in this.models)
	    {
		bitmapContainer.addChild(this.models[i].getInflatedBitmap().clone());
	    }
	    return bitmapContainer;
	},
		
	getStrokeCount: function() {
	    var strokeCount = 0;
	    for (var i in this.models)
	    {
		if (this.models[i].has('contains')) {
		    strokeCount += this.models[i].get('contains').length;
		} else {
		    strokeCount++;
		}
	    }
	    return strokeCount;
	}
	
    });
    
    
    return CanvasCharacter;
});