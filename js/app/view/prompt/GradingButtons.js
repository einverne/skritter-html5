/*
 * 
 * View: GradingButtons
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/grading-buttons.html',
    'backbone'
], function(templateGradingButtons) {

    var GradingButtons = Backbone.View.extend({
		
	initialize: function()	 {
	    GradingButtons.selected = false;
	},
	
	render: function() {
	    this.$el.append(templateGradingButtons); 
	    return this;
	},
		
	events: {
	    'click.GradingButtons #grade1': 'handleClick',
	    'click.GradingButtons #grade2': 'handleClick',
	    'click.GradingButtons #grade3': 'handleClick',
	    'click.GradingButtons #grade4': 'handleClick'
	},
		
	handleClick: function(value) {
	    if ($('#' + value.currentTarget.id).hasClass('selected')) {
		this.toggle();
	    } else {
		this.triggerSelected(value.currentTarget.id);
	    }
	},
		
	hide: function() {
	    this.$('#grading-buttons').hide();
	},
		
	remove: function() {
	    this.$('#grading-buttons').remove();
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
		$('#grade'+i).show(200);
	    }
	},
		
	triggerSelected: function(selected) {
	    if (selected !== undefined) {
		GradingButtons.selected = selected;
		this.trigger('selected', selected.replace(/[^\d]+/, ''));
	    }
	}
		
    });
    
    return GradingButtons;
});