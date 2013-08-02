/*
 * 
 * Collection: StudyData
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyStroke',
    'backbone'
], function(StudyStroke) {
    var Skritter = window.skritter;
    
    var StudyStrokes = Backbone.Collection.extend({
	
	initialize: function() {
	    //manually add the tones into the collection
	    this.add(new StudyStroke().set({
		lang: 'zh',
		rune: 'tone1',
		strokes: [[[383, 0.20, 0.20, 0.6, 0.1, 0.0]]]
	    }));
	    this.add(new StudyStroke().set({
		lang: 'zh',
		rune: 'tone2',
		strokes: [[[384, 0.25, 0.25, 0.5, 0.5, 0.0]]]
	    }));
	    this.add(new StudyStroke().set({
		lang: 'zh',
		rune: 'tone3',
		strokes: [[[385, 0.15, 0.20, 0.7, 0.6, 0.0]]]
	    }));
	    this.add(new StudyStroke().set({
		lang: 'zh',
		rune: 'tone4',
		strokes: [[[386, 0.25, 0.25, 0.5, 0.5, 0.0]]]
	    }));
	    this.add(new StudyStroke().set({
		lang: 'zh',
		rune: 'tone5',
		strokes: [[[387, 0.40, 0.40, 0.20, 0.20, 0.0]]]
	    }));
	},
	
	model: StudyStroke
	
    });
    
    return StudyStrokes;
});