/**
 * @module Skritter
 * @param Canvas
 * @param templateAdminRecogEditor
 * @author Joshua McFarland
 */
define([
    'views/admin/RecogCanvas',
    'require.text!templates/admin-recog-editor.html',
    'backbone'
], function(Canvas, templateAdminRecogEditor) {
    var Editor = Backbone.View.extend({
        initialize: function() {
            Editor.canvas = new Canvas();
            this.listenTo(Editor.canvas, 'mouseup', this.handleInputRecieved);
        },
        render: function() {
            this.$el.html(templateAdminRecogEditor);
            Editor.canvas.enableGrid();
            Editor.canvas.setElement(this.$('#canvas-container')).render();
            Editor.canvas.enableInput();
            
            Editor.canvas.drawStroke(skritter.assets.getStroke(108), 'stroke');
            Editor.canvas.drawParam(skritter.data.params.where({bitmapId: 108})[0], 'overlay');
            
            return this;
        },
        handleInputRecieved: function(points) {
            var rect = skritter.fn.getBoundingRectangle(points, 600, 600, 14);
            var stroke = skritter.assets.getStroke(108, 'green');
            var bounds = stroke.getBounds();
            stroke.x = rect.x;
            stroke.y = rect.y;
            stroke.scaleX =  rect.w / bounds.width;
            stroke.scaleY = rect.h / bounds.height;
            Editor.canvas.drawStroke(stroke, 'overlay');
        }
    });
    
    return Editor;
});