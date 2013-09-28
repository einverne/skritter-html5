/*
 * 
 * View: ParamBuilder
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/parambuilder-view.html',
    'Bitmaps',
    'collection/StudyParams',
    'view/admin/ParamBuilderCanvas',
    'view/Toolbar',
    'backbone'
], function(templateParamBuilder, Bitmaps, StudyParams, ParamBuilderCanvas, ToolbarView) {
    
    var ParamBuilderView = Backbone.View.extend({
	
    initialize: function() {
	    ParamBuilderView.bitmapId;
	    ParamBuilderView.canvas = new ParamBuilderCanvas({grid: true});
	    ParamBuilderView.paramId;
	    ParamBuilderView.params = new StudyParams(Bitmaps.getParams());
	    ParamBuilderView.toolbar = new ToolbarView();
	},
	
	template: templateParamBuilder,
	
	render: function() {
	    this.$el.html(this.template);
	    
	    ParamBuilderView.toolbar.setElement(this.$('#toolbar-container')).render();
	    ParamBuilderView.toolbar.addOption('{back}', 'back-button', ['button']);
	    
	    this.populateList();
	    
	    ParamBuilderView.canvas.setElement(this.$('#writing-area')).render();
	    if (ParamBuilderView.bitmapId && ParamBuilderView.paramId) {
		var param = ParamBuilderView.params.where({bitmapId: ParamBuilderView.bitmapId})[ParamBuilderView.paramId];
		ParamBuilderView.canvas.set(param);
		ParamBuilderView.canvas.drawBitmap();
		ParamBuilderView.canvas.drawParam();
		ParamBuilderView.canvas.drawUserBitmap();
		this.$('#offset-container #angle').val(param.get('offsetAngle'));
		this.$('#offset-container #x').val(param.get('offsetPosition').x);
		this.$('#offset-container #y').val(param.get('offsetPosition').y);
		this.$('#points-container #corners').val(JSON.stringify(param.get('corners')));
		this.$('#points-container #deviations').val(JSON.stringify(param.get('deviations')));
	    }
	    
	    return this;
	},
	
	events: {
	    'click.ParamBuilderView #back-button': 'back',
	    'click.ParamBuilderView div.param': 'handleSelection'
	},
		
	back: function() {
	    document.location.hash = '';
	},
		
	handleSelection: function(event) {
	    var paramId = event.currentTarget.id.replace('param-', '');
	    var bitmapId = event.currentTarget.parentElement.id.replace('bitmap-', '');
	    document.location.hash = 'param-builder/' + bitmapId + '/' + paramId;
	},
		
	populateList: function() {
	    var bitmaps = Bitmaps.toJSON();
	    for (var bitmapId in bitmaps)
	    {
		var bitmap = bitmaps[bitmapId];
		var params = bitmap.params;
		this.$('#bitmap-list').append("<div class='bitmap' id='bitmap-" + bitmapId + "'>Bitmap: " + Skritter.fn.pad(bitmapId, '0', 4) + "</div>");
		for (var paramId in params)
		{
		    var param = params[paramId];
		    this.$('#bitmap-list #bitmap-' + bitmapId).append("<div class='param' id='param-" + paramId + "'>Param: " + paramId + "</div>");
		}
	    }
	    this.$('#bitmap-list').height(Skritter.settings.get('appHeight') - this.$('#toolbar-container').height());
	},
		
	set: function(bitmapId, paramId) {
	    console.log('BitmapId:', bitmapId, 'ParamId:', paramId);
	    ParamBuilderView.bitmapId = bitmapId;
	    ParamBuilderView.paramId = paramId;
	    ParamBuilderView.canvas.clear();
	}
	
    });
    
    
    return ParamBuilderView;
});