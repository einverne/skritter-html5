/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class LeapController
     */
    var LeapController = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            LeapController.controller = new Leap.Controller();
            LeapController.canvasSize = Skritter.settings.get('canvasSize');
            LeapController.oldPt;
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
         * @param {Object} options
         */
        enable: function(options) {
            LeapController.canvasSize = Skritter.settings.get('canvasSize');
            LeapController.waitingCounter = 0;
            
            if (options)
                LeapController.controller = new Leap.Controller(options);
            
            LeapController.controller.on('animationFrame', _.bind(this.loop, this));
            LeapController.controller.connect();
        },
        /**
         * @method loop
         * @param {Object} frame
         */
        loop: function(frame) {
            if (frame.pointables.length > 0) {
                var finger = frame.pointables[0];
                var x = finger.tipPosition[0] + 150;
                var y = Math.abs(finger.tipPosition[1] - 400);
                var z = finger.tipPosition[2];
                var speed;
                //checks to make sure the pointer is within screen bounds
                if (x >= 0 && x <= 300 && y >= 0 && y <= 250) {
                    x = (x * LeapController.canvasSize) / 300;
                    y = (y * LeapController.canvasSize) / 250;
                    this.triggerMove(new createjs.Point(x, y));
                    if (LeapController.oldPt)
                        speed = Skritter.fn.getDistance({x: x, y: y}, LeapController.oldPt);
                    LeapController.oldPt = new createjs.Point(x, y);
                    //checks the speed to see if a stroke is happening
                    if (speed >= 12) {
                        LeapController.waitingCounter = 0;
                        LeapController.points.push(new createjs.Point(x, y));
                    } else {
                        //not drawing fast enough or stroke finished
                        if (LeapController.waitingCounter > 30) {
                            if (LeapController.points.length >= 5) {
                                this.triggerGestureComplete(LeapController.points);
                            }
                            LeapController.points = [];
                        }
                        LeapController.waitingCounter++;
                    }
                } else {
                    this.triggerMove(new createjs.Point(-30, -30));
                }
            }
        },
        /**
         * @method triggerGestureComplete
         * @param {Array} points
         */
        triggerGestureComplete: function(points) {
            this.trigger('gestureComplete', points);
        },
        /**
         * @method triggerMove
         * @param {Point} point
         */
        triggerMove: function(point) {
            this.trigger('move', point);
        }
    });


    return LeapController;
});