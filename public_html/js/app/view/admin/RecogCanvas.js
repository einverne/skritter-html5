/**
 * @module Skritter
 * @param PromptCanvas
 * @author Joshua McFarland
 */
define([
    'prompt/PromptCanvas',
], function(PromptCanvas) {
    /**
     * RecogCanvas
     */
    var Canvas = PromptCanvas.extend({
        
        drawParam: function(param) {
            PromptCanvas.layerOverlay.removeAllChildren();
            var corners = param.get('corners');
            for (var c in corners) {
                var corner = corners[c];
                var circle = new createjs.Shape();
                circle.graphics.beginFill('orange').drawCircle(corner.x, corner.y, 5);
                PromptCanvas.layerOverlay.addChild(circle);
            }
        },
        drawRawStroke: function(canvasStroke) {
            PromptCanvas.layerBackground.removeAllChildren();
            PromptCanvas.layerBackground.addChild(canvasStroke.getSprite());
        }
        
    });
    
    
    return Canvas;
});