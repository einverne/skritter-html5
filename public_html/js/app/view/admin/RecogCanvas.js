/**
 * @module Skritter
 * @param PromptCanvas
 * @author Joshua McFarland
 */
define([
    'prompt/PromptCanvas'
], function(PromptCanvas) {
    /**
     * @class RecogCanvas
     */
    var Canvas = PromptCanvas.extend({
        /**
         * @method clear
         */
        clear: function() {
            PromptCanvas.layerBackground.removeAllChildren();
            PromptCanvas.layerOverlay.removeAllChildren();
        },
        /**
         * @method drawParam
         * @param {StudyParam} param
         */
        drawParam: function(param) {
            var circle;
            PromptCanvas.layerOverlay.removeAllChildren();
            var corners = param.get('corners');
            for (var c in corners) {
                var corner = corners[c];
                circle = new createjs.Shape();
                circle.graphics.beginFill('orange').drawCircle(corner.x, corner.y, 5);
                PromptCanvas.layerOverlay.addChild(circle);
            }
            var deviations = param.get('deviations');
            for (var d in deviations) {
                var deviation = deviations[d];
                circle = new createjs.Shape();
                circle.graphics.beginFill('purple').drawCircle(deviation.x, deviation.y, 5);
                PromptCanvas.layerOverlay.addChild(circle);
            }
        },
        /**
         * @method drawRawStroke
         * @param {CanvasStroke} canvasStroke
         */
        drawRawStroke: function(canvasStroke) {
            PromptCanvas.layerBackground.removeAllChildren();
            PromptCanvas.layerBackground.addChild(canvasStroke.getSprite());
        }
        
    });
    
    
    return Canvas;
});