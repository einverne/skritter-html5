/*
 * 
 * View: Grid
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'mason',
    'backbone'
], function() {
    
    var GridView = Backbone.View.extend({
	
	initialize: function() {
	    GridView.fillerItemSelector = 'div.fillerBox';
	    GridView.gridSelector = '#grid';
	    GridView.gridItemSelector = 'div.box';
	},
	
	template: "<div id='grid-view'><div id='grid'></div></div>",
	
	render: function() {
	    this.$el.append(this.template);
	    return this;
	},
		
	addTile: function(content, id, classes) {
	    classes = (classes) ? classes : [];
	    var tile = document.createElement('div');
	    tile.setAttribute('class', 'box ' + classes);
	    tile.setAttribute('id', id);
	    $(tile).html(content);
	    $(this.$el.selector + ' #grid-view #grid').append(tile);
	},
		
	update: function() {
	    $(GridView.gridSelector).mason({
		itemSelector: GridView.gridItemSelector,
		ratio: 2,
		sizes: [
		    [1, 1]
		],
		columns: [
		    [0, 480, 1],
		    [480, 780, 2],
		    [780, 1080, 3],
		    [1080, 1320, 4],
		    [1320, 1680, 5]
		],
		filler: {
		    itemSelector: GridView.fillerItemSelector,
		    filler_class: 'custom_filler'
		},
		layout: 'fluid',
		gutter: 5
	    });
	}
	
    });
    
    
    return GridView;
});