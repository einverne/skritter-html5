/*
 * 
 * View: Recog
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
	    this.listenTo(RecogView.canvas, 'complete:stroke', function(stroke) {
		RecogView.canvas.drawPoints(stroke.get('corners'));
	    });
	},
	
	template: _.template(templateRecog),
		
	render: function() {
	    this.$el.html(this.template);
	    RecogView.canvas.setElement($('#recog-view #canvas-area')).render();
	    return this;
	},
		
	events: {
	    'click.RecogView #clear': 'clear',
	    'click.RecogView #draw': 'drawBitmap',
	    'click.RecogView #generate': 'generate'
	},
		
	clear: function() {
	    RecogView.canvas.clearAll(true);
	},
		
	drawBitmap: function() {
	    this.clear();
	    if ($('#bitmap-id').val())
		RecogView.canvas.drawRawStroke($('#bitmap-id').val());
	},
		
	generate: function() {
	    var stroke = RecogView.canvas.getCurrentStroke();
	    var param = new StudyParam();
	    if ($('#bitmap-id').val())
		param.set('bitmapId', parseInt($('#bitmap-id').val()));
	    param.set('corners', stroke.get('corners'));
	    param.set('deviations', stroke.getSegmentedDeviations());
	    if ($('#contains').val())
		param.set('contains', $('#contains').val().split(','));
	    if ($('#feedback').val())
		param.set('feedback', $('#feedback').val());
	    console.log(JSON.stringify(param.toJSON()) + ',');
	}
	
    });
    
    return RecogView;
});