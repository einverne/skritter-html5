/**
 * @module Skritter
 * @submodule Prompts
 * @param Canvas
 * @author Joshua McFarland
 */
define([
    'components/Canvas',
    'backbone',
    'createjs.easel',
    'createjs.tween'
], function(Canvas) {
    /**
     * @class RecogCanvas
     * @extends Canvas
     */
    var PromptCanvas = Canvas.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Canvas.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.createLayer('grid');
            this.createLayer('stroke');
            this.createLayer('param');
            this.createLayer('overlay');
            Canvas.prototype.render.call(this);
            return this;
        }
    });


    return PromptCanvas;
});