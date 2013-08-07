/*
 * 
 * Module: Recog
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyParam',
    'view/subview/Canvas',
    'require.text!template/admin/recog.html',
    'backbone'
], function(StudyParam, CanvasView, templateRecog) {
    
    var RecogView = Backbone.View.extend({
	
	initialize: function() {
	    RecogView.canvas = new CanvasView({recognizer: false});
	},
	
	template: _.template(templateRecog),
		
	render: function() {
	    this.$el.html(this.template);
	    RecogView.canvas.setElement($('#recog-view #canvas-area')).render();
	    return this;
	},
		
	events: {
	    'click.RecogView #draw': 'drawBitmap',
	    'click.RecogView #generate': 'generate'
	},
		
	drawBitmap: function() {
	    RecogView.canvas.drawRawStroke($('#bitmap-id').val());
	},
		
	generate: function() {
	    var stroke = RecogView.canvas.getCurrentStroke();
	    var param = new StudyParam();
	    param.set('corners', stroke.get('corners'));
	    param.set('deviations', stroke.getSegmentedDeviations());
	    if ($('#contains').val())
		param.set('contains', $('#contains').val().split(','));
	    if ($('#feedback').val())
		param.set('feedback', $('#feedback').val());
	    console.log(JSON.stringify(param.toJSON()));
	}
	
    });
    
    return RecogView;
});