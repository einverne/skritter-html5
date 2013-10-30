/**
 * @module Skritter
 * @param RecogCanvas
 * @param templateRecogEditor
 * @author Joshua McFarland
 */
define([
    'view/admin/RecogCanvas',
    'require.text!template/admin-recog-editor.html',
    'backbone'
], function(RecogCanvas, templateRecogEditor) {
    /**
     * @class RecogEditor
     */
    var Editor = Backbone.View.extend({
        initialize: function() {
            Editor.canvas = new RecogCanvas();
            Editor.strokes = Skritter.assets.getStrokeSpriteSheet();
        },
        render: function() {
            this.$el.html(templateRecogEditor);
            this.populateStrokeList();
            Editor.canvas.setElement(this.$('#canvas-container')).render();
            this.resize();
            return this;
        },
        load: function(strokeId, paramId) {
            
        },
        populateParamList: function(strokeId) {
            
        },
        populateStrokeList: function() {
            var strokeIds = Editor.strokes.getAnimations();
            for (var i in strokeIds) {
                strokeIds[i] = Skritter.fn.pad(strokeIds[i].replace('s', ''), 0, 4);
            }
            strokeIds.sort();
            for (i in strokeIds) {
                this.$('#stroke-list .panel-body').append("<div id='stroke-" + strokeIds[i].replace(/0/g, '') + "'>" + strokeIds[i] + "</div>");
            }
            
        },
        resize: function() {
            this.$('#canvas-container').width(Skritter.settings.get('canvasSize'));
            this.$('#stroke-list .panel-body').height(this.$el.height() - 100);
            this.$('#param-list .panel-body').height(this.$el.height() - 100);
        }
    });
    
    
    return Editor;
});