/**
 * @module Skritter
 * @param Canvas
 * @author Joshua McFarland
 */
define([
    'component/Canvas',
    'backbone'
], function(Canvas) {
    /**
     * @class RecogCanvas
     */
    var RecogCanvas = Canvas.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Canvas.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {RecogCanvas}
         */
        render: function() {
            Canvas.prototype.render.call(this);
            this.createLayer('background');
            this.createLayer('overlay');
            return this;
        }
    });
    
    
    return RecogCanvas;
});