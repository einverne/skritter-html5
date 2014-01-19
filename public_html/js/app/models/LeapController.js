/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class LeapController
     */
    var LeapController = Backbone.Model.extend({
        initialize: function() {
            LeapController.this = this;
            LeapController.controller = new Leap.Controller();
            LeapController.canvasSize = skritter.settings.get('canvasSize');
            LeapController.offsetX = 250;
            LeapController.offsetYMin = 150;
            LeapController.offsetYMax = 450;
            LeapController.offsetZ = 200;
            LeapController.oldPt = {};
            LeapController.points = [];
            LeapController.waitingCounter = 0;
        },
        /**
         * @method disable
         */
        disable: function() {
            LeapController.controller.removeAllListeners();
            LeapController.controller.disconnect();
        },
        /**
         * @method enable
         */
        enable: function() {
            LeapController.controller.on('animationFrame', this.loop);
            LeapController.controller.connect();
        },
        /**
         * @method loop
         * @param {Object} frame
         */
        loop: function(frame) {
            if (frame.pointables.length > 0) {
                var x = frame.pointables[0].tipPosition[0];
                var y = frame.pointables[0].tipPosition[1];
                var z = frame.pointables[0].tipPosition[2];
                console.log('leap', x, y, z);
            }
        }
    });
    
    return LeapController;
});