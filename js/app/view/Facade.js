define([
    'require.text!template/facade.html',
    'backbone'
], function(templateLoading) {
    
    var FacadeView = Backbone.View.extend({
	
	initialize: function() {
	  this.hide();
	  this.render();
	},
	
	el: $('#facade'),
	
	template: _.template(templateLoading),
	
	render: function() {
	    this.$el.html(this.template);
	    return this;
	},
		
	hide: function() {
	    $('#facade').hide();
	},
		
	message: function(message) {
	    $('#message').text(message);
	    return message;
	},
		
	show: function(message) {
	    message = (message) ? message : 'LOADING';
	    if (message)
		$('#message').text(message);
	    $('#icon').css('background',"url('img/logo/logo_skritter.png') no-repeat center");
	    $('#facade').show();
	}
	
    });
    
    return FacadeView;
});