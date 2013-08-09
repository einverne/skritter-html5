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
    var Skritter = window.skritter;
    
    function Recognizer(userCharacter, userStroke, userTargets) {
	//set the values for recognition
	this.currentPosition = userCharacter.getStrokeCount() + 1;
	this.stroke = userStroke;
	this.targets = userTargets;
	//set the scaled threshold values
	this.thresholdDistance = Skritter.user.get('thresholds').distance*(Skritter.settings.get('canvasWidth')/Skritter.settings.get('canvasMax'));
	this.thresholdDirection = Skritter.user.get('thresholds').direction;
	this.thresholdLength = Skritter.user.get('thresholds').length*(Skritter.settings.get('canvasWidth')/Skritter.settings.get('canvasMax'));
	this.thresholdOrderStrictness = parseInt(Skritter.user.get('thresholds').strictness);
    }
    
    //start the recognition process and return a result
    Recognizer.prototype.recognize = function() {
	var results = this.getResults();
	//console.log('All Results:');
	//console.log(results);
	for (var i in results)
	{
	    var item = results[i];
	    var scores = item.scores;
	    //weed out results that don't need the minimum thresholds
	    if (scores.distance > this.thresholdDistance)
		continue;
	    if (scores.direction > this.thresholdDirection)
		continue;
	    if (scores.length > this.thresholdLength)
		continue;
	    
	    //compares the current position against the actual item position
	    var orderOffset = item.position - this.currentPosition;
	    //checks that the order offset isn't greater than the strictness threshold
	    if (orderOffset > this.thresholdOrderStrictness)
		continue;
	    
	    var total = 0;
	    for (var s in scores)
	    {
		total += scores[s];
	    }
	    //calculate total for those who pass
	    results[i]['scoreTotal'] = total;
	    //console.log(results[i]);
	}

	//filter the results based on their scores
	results = _.filter(results, 'scoreTotal');

	//if there is a best result then return it
	if (results.length > 0) {
	    var matched = _.first(_.sortBy(results, 'scoreTotal'));
	    this.stroke.set('id', matched.id);
	    this.stroke.set('position', matched.position);
	    this.stroke.set('studyData', matched.studyData);
	    this.stroke.set('studyParams', matched.studyParams);
	    this.stroke.set('bitmapId', matched.bitmapId);
	    this.stroke.set('contains', matched.contains);
	    this.stroke.set('feedback', matched.feedback);
	    return this.stroke;
	}

	return false;
    };
    
    //returns an array will all possible result scores
    Recognizer.prototype.getResults = function() {
	var results = [];
	for (var a in this.targets)
	{
	    var variations = this.targets[a];
	    for (var b in variations.models)
	    {
		var id = variations.at(b).get('id');
		var bitmapId = variations.at(b).get('bitmapId');
		var position = variations.at(b).get('position');
		var variation = variations.at(b).get('variation');
		var studyData = variations.at(b).get('studyData');
		var studyParams = variations.at(b).get('studyParams');
		var inflatedStudyParams = variations.at(b).getInflatedStudyParams();
		
		variations.at(b).getBitmap();
		
		for (var c in inflatedStudyParams)
		{
		    var item = [];
		    var param = inflatedStudyParams[c];
		    
		    //passes the static data along with the character
		    item['id'] = id;
		    item['position'] = position;
		    item['variation'] = variation;
		    item['studyData'] = studyData;
		    item['studyParams'] = studyParams;
		    item['bitmapId'] = bitmapId;
		    item['contains'] = studyParams[c].get('contains');
		    item['feedback'] = studyParams[c].get('feedback');
		    
		    //stores all of the recognition results
		    var scores = {
			corners: this.compareCorners(param),
			distance: this.calculateDistance(param),
			direction: this.calculateDirection(param),
			length: this.calculateLength(param)
		    };
		    item['scores'] = scores;
		    
		    results.push(item);
		}
	    }
	}
	return results;
    };
    
    /*
     * custom recognition functions
     */
    
    //calculates the distances between the stroke starting points
    Recognizer.prototype.calculateDistance = function(param) {
	var score;
	score = Skritter.fn.getDistance(this.stroke.get('corners')[0], param.corners[0]);
	//console.log('Distance:'+score);
	return score;
    };
    
    //calculates the difference in the angle of the starting and ending points
    Recognizer.prototype.calculateDirection = function(param) {
	var score;
	score = Math.abs(this.stroke.getDirection() - Skritter.fn.getDirection(param.corners[0], param.corners[param.corners.length-1]));
	//console.log('Direction:'+score);
	return score;
    };
    
    //calculates the difference in the segment lenghts
    Recognizer.prototype.calculateLength = function(param) {
	var score;
	score = Math.abs(this.stroke.getLength() - Skritter.fn.getLength(param.corners));
	//console.log('Length:'+score);
	return score;
    };
    
    //penalizes strokes where the corners don't match up
    Recognizer.prototype.compareCorners = function(param) {
	var cornerPenalty = 50;
	if (this.stroke.get('corners').length !== param.corners.length)
	    return cornerPenalty;
	return 0;
    };
    
    return Recognizer;
});