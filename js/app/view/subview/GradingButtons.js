/*
 * 
 * View: GradingButtons
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/gradingbuttons.html',
    'backbone'
], function(templateGradingButtons) {

    var GradingButtonsView = Backbone.View.extend({
		
	initialize: function()	 {
	    GradingButtonsView.selected = false;
	},
		
	template: _.template(templateGradingButtons),
	
	render: function() {
	    this.$el.append(this.template); 
	    return this;
	},
		
	events: {
	    'click.GradingButtonsView #grade1': 'handleClick',
	    'click.GradingButtonsView #grade2': 'handleClick',
	    'click.GradingButtonsView #grade3': 'handleClick',
	    'click.GradingButtonsView #grade4': 'handleClick'
	},
		
	handleClick: function(value) {
	    if ($('#' + value.currentTarget.id).hasClass('selected')) {
		this.toggle();
	    } else {
		this.triggerSelected(value.currentTarget.id);
	    }
	},
		
	select: function(grade) {
	    for (var i=1; i <= 4; i++)
	    {
		if (grade === i) {
		    $('#grade'+i).addClass('selected');
		} else {
		    $('#grade'+i).hide();
		}
	    }
	},
		
	toggle: function() {
	    for (var i=1; i <= 4; i++)
	    {
		$('#grade'+i).removeClass('selected');
		$('#grade'+i).show(250);
	    }
	},
		
	triggerSelected: function(selected) {
	    if (selected !== undefined) {
		GradingButtonsView.selected = selected;
		this.trigger('selected', selected.replace(/[^\d]+/, ''));
	    }
	}
		
    });
    
    return GradingButtonsView;
});