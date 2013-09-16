/*
 * 
 * View: Toolbar
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'backbone'
], function() {
    
    var ToolbarView = Backbone.View.extend({
	
	render: function() {
	    this.$el.prepend("<div id='toolbar-view'></div>");
	    return this;
	},
	
	addOption: function(value, id, classes) {
	    classes = (classes) ? classes : [];
	    var element = document.createElement('div');
	    element.setAttribute('id', id);
	    element.setAttribute('class', 'toolbar-item ' + classes.join(' '));
	    $(element).html(value);
	    $(this.$el.selector + ' #toolbar-view').append(element);
	}
	
    });
    
    
    return ToolbarView;
});