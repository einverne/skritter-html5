/*
 * 
 * View: StudyBar
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'view/subview/Timer',
    'require.text!template/studybar.html',
    'backbone'
], function(Timer, templateStudyBar) {
    var Skritter = window.skritter;
    
    var StudyBarView = Backbone.View.extend({

	initialize: function() {
	    //load the timer in the global namespace
	    //so that it can be managed by other views
	    Skritter.timer = new Timer();
	},

	template: _.template(templateStudyBar),
	
	render: function() {
	    this.$el.html(this.template);
	    Skritter.timer.setElement($('#timer')).render();
	    return this;
	},
		
	events: {
	    'click.StudyBarView #home': 'home'
	},
		
	home: function() {
	    window.location.hash = '';
	}
	
    });
    
    return StudyBarView;
});