define([
    'backbone'
], function() {
   
    var StudyDecomp = Backbone.Model.extend({
	
	idAttribute: 'writing'
	
    });

    return StudyDecomp;
});