/**
 * @module Skritter
 * @submodule Prompt
 * @param Canvas
 * @author Joshua McFarland
 */
define([
    'component/Canvas',
    'backbone',
    'createjs.easel',
    'createjs.tween'
], function(Canvas) {
    /**
     * @class PromptCanvas
     * @extends Canvas
     */
    var PromptCanvas = Canvas.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Canvas.prototype.initialize.call(this);
            PromptCanvas.leapPointer = null;
            PromptCanvas.motionIndicator = null;
        },
        /**
         * @method render
         * @returns {PromptCanvas}
         */
        render: function() {
            Canvas.prototype.render.call(this);
            this.createLayer('background');
            this.createLayer('hint');
            this.createLayer('stroke');
            this.createLayer('overlay');
            this.createLayer('indicator');
            this.createLayer('feedback');
            return this;
        },
        updateLeapPointer: function(x, y, color) {
            color = (color) ? color : 'black';
            if (!PromptCanvas.leapPointer) {
                PromptCanvas.leapPointer = new createjs.Shape(new createjs.Graphics().clear().beginFill(color).drawCircle(x, y, 15).endFill());
                this.getLayer('indicator').addChild(PromptCanvas.leapPointer);
            }
            PromptCanvas.leapPointer.graphics.clear().beginFill(color).drawCircle(x, y, 15).endFill();
        }
    });


    return PromptCanvas;
});