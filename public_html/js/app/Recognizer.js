/**
 * @module Skritter
 * @param StudyParam
 * @author Joshua McFarland
 */
define([
    'models/StudyParam',
    'lodash'
], function(StudyParam) {
    /**
     * @class Recognizer
     * @param {CanvasCharacter} userCharacter
     * @param {CanvasStroke} userStroke
     * @param {Array} userTargets
     * @constructor
     */
    function Recognizer(userCharacter, userStroke, userTargets) {
        //set the values for recognition
        this.currentPosition = userCharacter.getStrokeCount() + 1;
        this.stroke = userStroke;
        this.targets = userTargets;
        this.canvasSize = skritter.settings.get('canvasSize');
        //set the scaled threshold values
        this.angleThreshold = 30;
        this.distanceThreshold = 150 * (this.canvasSize / 600);
        this.lengthThreshold = 300 * (this.canvasSize / 600);
        this.orderStrictness = 0;
    }

    /**
     * @method recognize
     * @param {Array} ignoreCheck
     * @param {Boolean} enforceOrder
     * @returns {CanvasStroke}
     */
    Recognizer.prototype.recognize = function(ignoreCheck, enforceOrder) {
        var results = this.getResultSet();
        if (enforceOrder)
            this.orderStrictness = 0;
        for (var i in results)
        {
            var result = results[i];
            var scores = result.scores;
            if (!_.contains(ignoreCheck, 'corners')) {
                if (scores.corners === false)
                    continue;
            }
            if (!_.contains(ignoreCheck, 'angle')) {
                if (scores.angle > this.angleThreshold)
                    continue;
            }
            if (!_.contains(ignoreCheck, 'distance')) {
                if (scores.distance > this.distanceThreshold)
                    continue;
            }
            if (!_.contains(ignoreCheck, 'length')) {
                if (scores.length > this.lengthThreshold)
                    continue;
            }

            /*if (!_.contains(ignoreCheck, 'offset')) {
                var orderOffset = result.position - this.currentPosition;
                if (_.contains(ignoreCheck, 'offset') || orderOffset > this.orderStrictness)
                    continue;
            }*/

            var total = 0;
            for (var s in scores)
            {
                total += scores[s];
            }
            results[i].result = total;
        }

        results = _.filter(results, 'result');
        
        if (results.length > 0) {
            var matched = _.first(_.sortBy(results, 'result'));
            this.stroke.set('bitmapId', matched.bitmapId);
            this.stroke.set('contains', matched.contains);
            this.stroke.set('data', matched.data);
            this.stroke.set('feedback', matched.feedback);
            this.stroke.set('id', matched.id);
            this.stroke.set('params', matched.params);
            this.stroke.set('part', matched.part);
            this.stroke.set('position', matched.position);
            this.stroke.set('result', matched.result);
            this.stroke.set('scores', matched.scores);
            this.stroke.set('sprite', matched.sprite);
            return this.stroke;
        }

        return null;
    };

    /**
     * @method getResultSet
     * @returns {Array}
     */
    Recognizer.prototype.getResultSet = function() {
        var results = [];
        var maxPosition = this.currentPosition + this.orderStrictness;
        var minPosition = this.currentPosition - this.orderStrictness;
        for (var a in this.targets) {
            var variations = this.targets[a];
            for (var b in variations.models) {
                var stroke = variations.at(b);
                var position = stroke.get('position');
                //filters out items not possible based on strictness settings
                if (minPosition > position || position > maxPosition)
                    continue;
                //sets the remaining values to be passed to resultset
                var bitmapId = stroke.get('bitmapId');
                var data = stroke.get('data');
                var id = stroke.get('id');
                var params = stroke.getInflatedParams();
                var part = stroke.get('part');
                var variation = stroke.get('variation');
                var rune = stroke.get('rune');
                var sprite = stroke.get('sprite');

                //TODO: update this backwards check to use the new params concept
                //right now it's just a hack to manually inject params backwards
                //don't check accept anything backwards when studying squigs
                if (!skritter.user.getSetting('squigs')) {
                    var reverseCorners = _.cloneDeep(params[0].get('corners')).reverse();
                    var reverseDeviations = _.cloneDeep(params[0].get('deviations')).reverse();
                    params.push(new StudyParam({
                        bitmapId: bitmapId,
                        data: data,
                        contains: params[0].get('contains'),
                        corners: reverseCorners,
                        deviations: reverseDeviations,
                        feedback: 'backwards',
                        id: id,
                        param: param,
                        part: part,
                        position: position,
                        variation: variation,
                        rune: rune,
                        sprite: sprite,
                        stroke: stroke
                    }));
                }

                for (var p in params) {
                    var result = [];
                    var param = params[p];

                    var scores = {
                        angle: this.checkAngle(param),
                        corners: this.checkCorners(param),
                        distance: this.checkDistance(param),
                        length: this.checkLength(param)
                    };

                    result.bitmapId = bitmapId;
                    result.contains = param.get('contains');
                    result.data = data;
                    result.feedback = param.get('feedback');
                    result.id = id;
                    result.param = param;
                    result.part = part;
                    result.position = position;
                    result.variation = variation;
                    result.rune = rune;
                    result.scores = scores;
                    result.sprite = sprite;
                    results.push(result);
                }
            }
        }
        return results;
    };

    /**
     * @method checkAngle
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkAngle = function(param) {
        var score = Math.abs(this.stroke.getAngle() - param.getAngle());
        return score;
    };

    /**
     * @method checkCorners
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkCorners = function(param) {
        var cornerPenalty = 200;
        var cornerDiff = Math.abs(param.get('corners').length - this.stroke.get('corners').length);
        if (cornerDiff > 1)
            return false;
        return cornerDiff * cornerPenalty;
    };

    /**
     * @method checkDistance
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(param) {
        //ISSUE #75: might be better to check the distance from the mid-points
        var score = skritter.fn.getDistance(skritter.fn.getBoundingRectangle(this.stroke.get('corners'), this.canvasSize, this.canvasSize, 6),
                skritter.fn.getBoundingRectangle(param.get('corners'), this.canvasSize, this.canvasSize, 6));
        return score;
    };

    /**
     * @method checkLength
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkLength = function(param) {
        var score = Math.abs(this.stroke.getLength() - param.getLength());
        return score;
    };


    return Recognizer;
});