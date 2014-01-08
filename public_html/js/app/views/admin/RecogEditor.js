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
    /**
     * @class AdminRecogEditor
     */
    var Editor = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Editor.canvas = new Canvas();
            Editor.id = 0;
            Editor.params = null;
            Editor.stroke = null;
            Editor.tween = true;
            this.listenTo(Editor.canvas, 'mouseup', this.handleInputRecieved);
        },
        /**
         * @method render
         * @return {Backbone.View}
         */
        render: function() {
            this.$el.html(templateAdminRecogEditor);
            Editor.canvas.enableGrid();
            Editor.canvas.setElement(this.$('#canvas-container')).render();
            Editor.canvas.clear('param');
            Editor.canvas.clear('stroke');
            Editor.canvas.enableInput();
            this.clear();
            this.drawStroke();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Editor #admin-recog-editor-view .clear-button': 'clear',
            'click.Editor #admin-recog-editor-view .previous-button': 'previousStroke',
            'click.Editor #admin-recog-editor-view .next-button': 'nextStroke'
        },
        /**
         * @method clear
         */
        clear: function() {
            Editor.canvas.clear('overlay');
        },
        /**
         * @method drawStroke
         */
        drawStroke: function() {
            Editor.stroke = skritter.assets.getStroke(Editor.id);
            Editor.params = skritter.data.params.where({bitmapId: Editor.id});
            Editor.canvas.drawStroke(Editor.stroke, 'stroke');
            Editor.canvas.drawParam(Editor.params[0], 'param');
        },
        /**
         * @method handleInputRecieved
         * @param {Array} points
         */
        handleInputRecieved: function(points) {
            var canvasSize = skritter.settings.get('canvasSize');
            var rect = skritter.fn.getBoundingRectangle(points, canvasSize, canvasSize, 14);
            var stroke = skritter.assets.getStroke(Editor.id, 'green');
            var userStroke = stroke.clone();
            var angleOffset = skritter.fn.getAngle(points) - Editor.params[0].getAngle();
            //var bounds = userStroke.getBounds();
            userStroke.x = rect.x;
            userStroke.y = rect.y;
            //userStroke.regX = bounds.x / 2;
            //userStroke.regY = bounds.y / 2;
            //userStroke.scaleX = rect.w / bounds.width;
            //userStroke.scaleY = rect.h / bounds.height;
            //userStroke.rotation = angleOffset;
            if (Editor.tween) {
                Editor.canvas.drawTweenedStroke(userStroke, stroke, 'overlay');
            } else {
                Editor.canvas.drawStroke(stroke, 'overlay');
            }
        },
        /**
         * @method nextStroke
         * @returns {Number}
         */
        nextStroke: function() {
            Editor.id++;
            skritter.router.navigate('admin/recog/editor/' + Editor.id, {replace: true, trigger: true});
        },
        /**
         * @method previousStroke
         * @returns {Number}
         */
        previousStroke: function() {
            Editor.id--;
            skritter.router.navigate('admin/recog/editor/' + Editor.id, {replace: true, trigger: true});
        },
        /**
         * @method set
         * @param {Number} id
         */
        set: function(id) {
            if (id) {
                Editor.id = parseInt(id, 10);
            } else {
                skritter.router.navigate('admin/recog/editor/0', {replace: true, trigger: true});
            }
        }
    });

    return Editor;
});