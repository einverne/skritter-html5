/*
 * 
 * Module: Recognizer
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'lodash'
], function() {
    
    function Recognizer(userCharacter, userStroke, userTargets) {
	//set the values for recognition
	this.currentPosition = userCharacter.getStrokeCount() + 1;
	this.stroke = userStroke;
	this.targets = userTargets;
	
	//set the scaled threshold values
	this.angleThreshold = 45;
	this.distanceThreshold = 100 * Skritter.settings.getCanvasAspectRatio();
	this.lengthThreshold = 200 * Skritter.settings.getCanvasAspectRatio();
	this.orderStrictness = 0;
    }
    
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
	    results[i]['result'] = total;
	}
	
	var results = _.filter(results, 'result');
	
	if (results.length > 0) {
	    var matched = _.first(_.sortBy(results, 'result'));
	    this.stroke.set('bitmap', matched.bitmap);
	    this.stroke.set('bitmapId', matched.bitmapId);
	    this.stroke.set('contains', matched.contains);
	    this.stroke.set('data', matched.data);
	    this.stroke.set('feedback', matched.feedback);
	    this.stroke.set('id', matched.id);
	    this.stroke.set('params', matched.params);
	    this.stroke.set('position', matched.position);
	    this.stroke.set('result', matched.result);
	    this.stroke.set('scores', matched.scores);
	    return this.stroke;
	}

	return false;
    };
    
    Recognizer.prototype.getResultSet = function() {
	var results = [];
	for (var a in this.targets)
	{
	    var variations = this.targets[a];
	    for (var b in variations.models)
	    {
		var bitmap = variations.at(b).get('bitmap');
		var bitmapId = variations.at(b).get('bitmapId');
		var data = variations.at(b).get('data');
		var id = variations.at(b).get('id');
		var params = variations.at(b).getInflatedParams();
		var position = variations.at(b).get('position');
		var variation = variations.at(b).get('variation');
		var rune = variations.at(b).get('rune');
		
		for (var p in params) {
		    var result = [];
		    var param = params[p];
		    
		    var scores = {
			angle: this.checkAngle(param),
			distance: this.checkDistance(param),
			length: this.checkLength(param)
		    };
		    
		    result['bitmap'] = bitmap;
		    result['bitmapId'] = bitmapId;
		    result['contains'] = param.get('contains');
		    result['data'] = data;
		    result['feedback'] = param.get('feedback');
		    result['id'] = id;
		    result['params'] = param;
		    result['position'] = position;
		    result['variation'] = variation;
    		    result['rune'] = rune;
		    result['scores'] = scores;
		    results.push(result);
		}
	    }
	}
	return results;
    };
    
    Recognizer.prototype.checkAngle = function(param) {
	var score = Math.abs(this.stroke.getAngle() - param.getAngle());
	return score;
    };
    
    Recognizer.prototype.checkDistance = function(param) {
	var score = Skritter.fn.getDistance(this.stroke.get('corners')[0], param.get('corners')[0]);
	return score;
    };
    
    Recognizer.prototype.checkLength = function(param) {
	var score = Math.abs(this.stroke.getLength() - param.getLength());
	return score;
    };
    
    
    return Recognizer;
});