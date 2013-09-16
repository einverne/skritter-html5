/*
 * 
 * View: Facade
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/facade-view.html',
    'backbone'
], function(templateFacade) {
    
    var FacadeView = Backbone.View.extend({
	
	initialize: function() {
	    this.render();
	},
		
	template: templateFacade,
	
	render: function() {
	    this.$el.html(this.template);
	    return this;
	},
		
	hide: function() {
	    $(this.el).hide();
	},
		
	show: function(value) {
	    if (value) {
		this.$('#display').html(value);
	    } else {
		this.$('#display').hide();
	    }
	    $(this.el).show();
	}
	
    });
    
    
    return FacadeView;
});