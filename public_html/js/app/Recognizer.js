/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'model/StudyParam',
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
	
	//set the scaled threshold values
	this.angleThreshold = 30;
	this.distanceThreshold = 150 * (Skritter.settings.get('canvasSize') / 600);
	this.lengthThreshold = 250 * (Skritter.settings.get('canvasSize') / 600);
	this.orderStrictness = 0;
    }
    
    /**
     * @method recognize
     * @returns {CanvasStroke}
     */
    Recognizer.prototype.recognize = function() {
	var results = this.getResultSet();
	for (var i in results)
	{
	    var result = results[i];
	    var scores = result.scores;
	    if (scores.angle > this.angleThreshold)
		continue;
	    if (scores.distance > this.distanceThreshold)
		continue;
	    if (scores.length > this.lengthThreshold)
		continue;
	    
	    var orderOffset = result.position - this.currentPosition;
	    if (orderOffset > this.orderStrictness)
		continue;
	    
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
	for (var a in this.targets)
	{
	    var variations = this.targets[a];
	    for (var b in variations.models)
	    {
		var bitmapId = variations.at(b).get('bitmapId');
		var data = variations.at(b).get('data');
		var id = variations.at(b).get('id');
		var params = variations.at(b).getInflatedParams();
		var part = variations.at(b).get('part');
		var position = variations.at(b).get('position');
		var variation = variations.at(b).get('variation');
		var rune = variations.at(b).get('rune');
                var sprite = variations.at(b).get('sprite');
		
                //todo: update this backwards check to use the new params concept
                //right now it's just a hack to manually inject params backwards
                var reverseCorners = _.cloneDeep(params[0].get('corners')).reverse();
                var reverseDeviations = _.cloneDeep(params[0].get('deviations')).reverse();
                params.push(new StudyParam({
                    bitmapId: bitmapId,
                    corners: reverseCorners,
                    deviations: reverseDeviations,
                    feedback: 'backwards'
                }));
                
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
        var cornerPenalty = 50;
        return Math.abs(param.get('corners').length - this.stroke.get('corners').length) * cornerPenalty;
    };
    
    /**
     * @method checkDistance
     * @param {StudyParam} param
     * @returns {Number}
     */
    Recognizer.prototype.checkDistance = function(param) {
	var score = Skritter.fn.getDistance(this.stroke.get('corners')[0], param.get('corners')[0]);
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