/*
 * 
 * Model: Assets
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Uses PreloadJS to manage asset loading and updates the model based on the queues status.
 * 
 */
define([
    'backbone',
    'createjs.preload',
    'lodash'
], function() {
    var Skritter = window.skritter;

    var Assets = Backbone.Model.extend({
	
	initialize: function() {
	    Assets.queue = new createjs.LoadQueue();
	    
	    handleComplete = function() {
		this.triggerComplete();
		this.set('ready', true);
	    };
	    
	    handleError = function(event) {
		console.error(event);
	    };
	    
	    handleLoadStart = function() {
		this.set('ready', false);
	    };
	    
	    Assets.queue.addEventListener('complete', _.bind(handleComplete, this));
	    Assets.queue.addEventListener('error', _.bind(handleError, this));
	    Assets.queue.addEventListener('loadstart', _.bind(handleLoadStart, this));
	},
		
	defaults: {
	    ready: true
	},
		
	addItem: function(src, group, name) {
	    Assets.queue.loadFile({
		src: src,
		id: group + '_' + name
	    }, true);
	},
		
	addManifest: function(manifest) {
	    Assets.queue.loadManifest(manifest, true);
	},
		
	getItem: function(group, id) {
	    if (group && id)
		return Assets.queue.getItem(group + '_' + id);
	},
		
	loadButtons: function() {
	    var buttons = [
		'grade1',
		'grade2', 
		'grade3', 
		'grade4',
		'add',
		'back',
		'audio_none',
		'info'
	    ];
	    for (var i in buttons)
	    {
		Assets.queue.loadFile({id: 'button_' + buttons[i], src: 'img/button/' + buttons[i] + '.png'});
	    }
	},
		
	loadStrokes: function() {
	    for (var i = 0; i <= 387; i++)
	    {
		Assets.queue.loadFile({id: 'stroke_' + i, src: 'img/stroke/' + Skritter.fn.zeroPad(i, 4) + '.png'});
	    }
	},
	
	triggerComplete: function() {
	    this.trigger('complete', Assets.queue);
	}

    });

    return Assets;
});