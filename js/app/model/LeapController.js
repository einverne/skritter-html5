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
         * @param {Object} options
         */
        enable: function(options) {
            LeapController.canvasSize = Skritter.settings.get('canvasSize');
            LeapController.waitingCounter = 0;
            LeapController.offsetX = parseFloat(Skritter.user.get('leapOffsetX'));
            LeapController.offsetYMin = parseFloat(Skritter.user.get('leapOffsetYMin'));
            LeapController.offsetYMax = parseFloat(Skritter.user.get('leapOffsetYMax'));
            LeapController.offsetZ = parseFloat(Skritter.user.get('leapOffsetZ'));
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
                //check to make sure finger is close enough for writing
                if (finger.tipPosition[2] < LeapController.offsetZ) {
                    //TODO: give X offset min and max bounds for different screen sizes
                    var x = finger.tipPosition[0] + LeapController.offsetX;
                    var y = Math.abs(finger.tipPosition[1] - 600);
                    //apply bounds to the y axis
                    if (y > LeapController.offsetYMin && y < LeapController.offsetYMax) {
                        y -= 150;
                        y = (Skritter.settings.get('canvasSize') / 300) * y;
                    }
                    this.triggerMoving(new createjs.Point(x, y));
                    var speed;
                    if (LeapController.oldPt)
                        speed = Skritter.fn.getDistance({x: x, y: y}, LeapController.oldPt);
                    LeapController.oldPt = new createjs.Point(x, y);
                    //checks the speed to see if a stroke is happening
                    if (speed >= 10) {
                        LeapController.waitingCounter = 0;
                        LeapController.points.push(new createjs.Point(x, y));
                    } else {
                        //not drawing fast enough or stroke finished
                        if (LeapController.waitingCounter > 15) {
                            if (LeapController.points.length >= 5) {
                                this.triggerStrokeComplete(LeapController.points);
                            }
                            LeapController.points = [];
                        }
                        LeapController.waitingCounter++;
                    }
                } else {
                    this.triggerMoving(new createjs.Point(-30, -30));
                }
            }
        },
        /**
         * @method triggerGestureComplete
         * @param {Array} points
         */
        triggerStrokeComplete: function(points) {
            //console.log(points);
            this.trigger('strokeComplete', points);
        },
        /**
         * @method triggerMove
         * @param {Point} point
         */
        triggerMoving: function(point) {
            this.trigger('moving', point);
        }
    });


    return LeapController;
});