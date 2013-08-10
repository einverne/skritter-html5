/*
 * 
 * Module: Settings
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/settings.html',
    'backbone'
], function(templateSettings) {
    var Skritter = window.skritter;
    
    var SettingsView = Backbone.View.extend({
	
	template: _.template(templateSettings),
	
	render: function() {
	    this.$el.html(this.template);
	    
	    //load the current settings
	    this.load();
	    
	    //slide down the content section
	    $('#content').slideDown('slow');
	    
	    return this;
	},
		
	events: {
	    'click.SettingsView #cancel': 'cancel',
	    'click.SettingsView #save': 'save'
	},
		
	cancel: function() {
	    window.history.back();
	},
		
	load: function() {
	    $('#thresholdDistance').val(Skritter.user.get('thresholds').distance);
	    $('#thresholdDirection').val(Skritter.user.get('thresholds').direction);
	    $('#thresholdLength').val(Skritter.user.get('thresholds').length);
	    $('#thresholdOrderStrictness').val(Skritter.user.get('thresholds').strictness);
	    $('#rawSquigs').prop('checked', Skritter.user.get('rawSquigs'));
	    $('#rune').prop('checked', Skritter.user.get('parts').rune);
	    $('#tone').prop('checked', Skritter.user.get('parts').tone);
	    $('#defn').prop('checked', Skritter.user.get('parts').defn);
	    $('#rdng').prop('checked', Skritter.user.get('parts').rdng);
	},
		
	save: function() {
	    var thresholds = {
		distance:$('#thresholdDistance').val(),
		direction:$('#thresholdDirection').val(),
		length:$('#thresholdLength').val(),
		strictness:$('#thresholdOrderStrictness').val()
	    };
	    Skritter.user.set('thresholds', thresholds);
	    Skritter.user.set('rawSquigs', $('#rawSquigs').prop('checked'));
	    var parts = {
		defn:$('#defn').prop('checked'),
		rdng:$('#rdng').prop('checked'),
		rune:$('#rune').prop('checked'),
		tone:$('#tone').prop('checked')
	    };
	    Skritter.user.set('parts', parts);
	    window.history.back();
	}
	
    });
    
    return SettingsView;
});