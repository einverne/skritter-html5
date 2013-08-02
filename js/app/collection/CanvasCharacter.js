define([
    'model/CanvasStroke',
    'backbone'
], function(CanvasStroke) {
    
    var CanvasCharacter = Backbone.Collection.extend({
	
	model: CanvasStroke,
	
	containsStroke: function(stroke) {
	    var strokeId = stroke.get('id');
	    var strokeContains = stroke.get('contains');
	    for (var i in this.models)
	    {
		var id = this.models[i].get('id');
		var position = this.models[i].get('position');
		//directly check for strokes position
		if (id === strokeId) {
		    return true;
		}
		//backwards check
		if (this.models[i].has('contains')) {
		    var contains = this.models[i].get('contains');
		    for (var a in contains)
		    {	
			var containsId = (parseInt(position)+parseInt(a)) + '|' + contains[a];
			if (containsId === strokeId)
			    return true;
		    }
		}
		//forward check
		if (strokeContains) {
		    for (var b in strokeContains)
		    {
			var containsId = (position-b) + '|' + strokeContains[b];
			if (containsId === id)
			    return true;
		    }
		}
	    }
	    return false;
	},
	
	getCharacterContainer: function() {
	    var container = new createjs.Container();
	    for (var i in this.models)
	    {
		container.addChild(this.models[i].getBitmapContainer(true));
	    }
	    return container;
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