/*
 * 
 * Module: Frame
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'jquery'
], function() {
    var Skritter = window.skritter;
    
    var horizontal = {
	
    };
    
    var vertical = {
	container: function() {
	    var width = $(Skritter.settings.get('container')).width();
	    var height = $(Skritter.settings.get('container')).height();
	    var canvasMax = Skritter.settings.get('canvasMax');
	    
	    Skritter.settings.set('width', width);
	    Skritter.settings.set('height', height);
	    
	    if (width > canvasMax) {
		Skritter.settings.set('canvasWidth', canvasMax);
		Skritter.settings.set('canvasHeight', canvasMax);
	    } else {
		Skritter.settings.set('canvasWidth', width);
		Skritter.settings.set('canvasHeight', width);
	    }
	},
		
	study: function() {
	    var studybar = $('#study-view #studybar').height();
	    var top = Skritter.settings.get('height') - Skritter.settings.get('canvasWidth') - studybar;
	    var bottom = Skritter.settings.get('height') - studybar - top;
	    var bottomPrompt = Skritter.settings.get('canvasWidth');
	    
	    $('#study-view #top').css('height', top+'px');
	    $('#study-view #bottom').css('height', bottom+'px');
	    $('#study-view #bottom-prompt').css({
		'width':bottomPrompt+'px',
		'height':bottomPrompt+'px'
	    });
	    /*$('#study-view #canvas-prompt').css({
		'width':bottomPrompt+'px',
		'height':bottomPrompt+'px'
	    });*/
	}
    };
    
    return {
	horizontal: horizontal,
	vertical: vertical
    };
});