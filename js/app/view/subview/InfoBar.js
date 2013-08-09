/*
 * 
 * View: InfoBar
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/infobar.html',
    'backbone'
], function(templateInfoBar) {
    
    var StudyBarView = Backbone.View.extend({

	initialize: function() {
	},

	template: _.template(templateInfoBar),
	
	render: function() {
	    this.$el.html(this.template);
	    return this;
	},
		
	events: {
	    'click.InfoBarView #close': 'close'
	},
		
	close: function() {
	    window.history.back();
	}
	
    });
    
    return StudyBarView;
});