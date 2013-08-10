define([
    'Maul',
    'Shortstraw',
    'backbone'
], function(Maul) {
    var Skritter = window.skritter;
    
    var CanvasStroke = Backbone.Model.extend({
	
	initialize: function() {
	    this.on('change:points', this.getCorners);
	},
	
	defaults: {
	    bitmapId: null,
	    corners: [],
	    variation: null,
	    points: [],
	    position: null,
	    rune: null,
	    studyData: null,
	    studyParams: [],
	    squigVisible: false,
	    strokeVisible: false
	},
		
	getBitmap: function() {
	    var image = Skritter.assets.getItem('stroke', ''+this.get('bitmapId'));
	    var bitmap = new createjs.Bitmap(image.src);
	    return bitmap;
	},
		
	getBitmapContainer: function(inflated) {
	    var bitmapBase = new createjs.Container();
	    var bitmap = this.getBitmap();
	    
	    if (inflated) {
		var inflatedStudyData = this.getInflatedStudyData();
		bitmap.scaleX = inflatedStudyData.scaleX;
		bitmap.scaleY = inflatedStudyData.scaleY;
		bitmapBase.regX = inflatedStudyData.regX;
		bitmapBase.regY = inflatedStudyData.regY;
		bitmapBase.x = bitmapBase.regX + inflatedStudyData.x;
		bitmapBase.y = bitmapBase.regY + inflatedStudyData.y;
		bitmapBase.rotation = inflatedStudyData.rotation;
	    }
	    
	    bitmapBase.addChild(bitmap);
	    return bitmapBase;
	},
		
	getBitmapDimensions: function() {
	    var image = Skritter.assets.getItem('stroke', ''+this.get('bitmapId'));
	    return { w:image.tag.width, h:image.tag.height };
	},
		
	getContainedStrokeIds: function() {
	    var ids = [];
	    
	    if (!this.has('contains')) {
		ids.push(this.get('id'));
		return ids;
	    }
	    
	    var contains = this.get('contains');
	    var position = this.get('position');
	    for (var i in contains)
	    {
		var contained = contains[i];
		ids.push(position + '|' + contained);
		ids.push((position+1) + '|' + contained);
	    }
	    
	    return ids;
	},
	
	getCorners: function() {
	    if (this.get('points').length === 0)
		return false;
	    var corners = new Shortstraw(this.get('points'));
	    this.set('corners', corners);
	    return this.corners;
	},
		
	getInflatedStudyData: function() {
	    var studyData = this.get('studyData');
	    var bitmap = this.getBitmapDimensions();
	    return new Maul(studyData, bitmap, Skritter.settings.get('canvasWidth'));
	},
		
	getInflatedStudyParams: function() {
	    var inflatedStudyParams = [];
	    var studyParams = this.get('studyParams');
	    var inflatedData = this.getInflatedStudyData();
	    
	    for (var a in studyParams)
	    {
		var inflatedStudyParam = [];
		var studyParam = studyParams[a];
		
		//inflates the study param corners
		var corners = _.cloneDeep(studyParam.get('corners'));
		var inflatedCorners = [];
		for (var b in corners) 
		{
		    corners[b].x = corners[b].x * inflatedData.scaleX + inflatedData.x;
		    corners[b].y = corners[b].y * inflatedData.scaleY + inflatedData.y;
		    inflatedCorners.push(corners[b]);
		}
		
		//inflates the study param deviations
		var deviations = _.cloneDeep(studyParam.get('deviations'));
		var inflatedDeviations = [];
		for (var c in deviations)
		{
		    deviations[c].x = deviations[c].x * inflatedData.scaleX + inflatedData.x;
		    deviations[c].y = deviations[c].y * inflatedData.scaleY + inflatedData.y;
		    inflatedDeviations.push(deviations[c]);
		}
		
		//add the param to the array of params
		inflatedStudyParam['corners'] = inflatedCorners;
		inflatedStudyParam['deviations'] = inflatedDeviations;
		inflatedStudyParams.push(inflatedStudyParam);
	    }
	    return inflatedStudyParams;
	},
		
	getDirection: function() {
	    var corners = this.get('corners');
	    return Skritter.fn.getDirection(corners[0], corners[corners.length - 1]);
	},
		
	getLength: function() {
	    var length = 0;
	    for (var i = 0; i < this.get('corners').length - 1; i++)
	    {
		length += Skritter.fn.getDistance(this.get('corners')[i], this.get('corners')[i + 1]);
	    }
	    return length;
	},
		
	getMidPoint: function() {
	    var points = this.get('points');
	    return new createjs.Point((points[0].x + points[points.length-1].x)/2, (points[0].y + points[points.length-1].y)/2);
	},
		
	getRectangle: function() {
	    var left = Skritter.settings.get('canvasWidth');
	    var top = 0.0;
	    var right = 0.0;
	    var bottom = Skritter.settings.get('canvasHeight');
	    for (var i in this.get('points'))
	    {
		var x = this.get('points')[i].x;
		var y = this.get('points')[i].y;
		var press_radius = 14;

		if (x - press_radius < left)
		    left = x - press_radius;
		if (y + press_radius > top)
		    top = y + press_radius;
		if (x + press_radius > right)
		    right = x + press_radius;
		if (y - press_radius < bottom)
		    bottom = y - press_radius;
	    }
	    return {x: left, y: bottom, w: right - left, h: top - bottom};
	},
		
	getRectangleMidPoint: function() {
	    var rect = this.getRectangle();
	    return new createjs.Point((rect.x+rect.w)/2, (rect.y+rect.h)/2);
	},
		
	getSegmentedDeviations: function() {
	    var deviationPoints = [];
	    var corners = this.get('corners');
	    var points = _.clone(this.get('points'));
	    for (var a=1; a < corners.length; a++)
	    {
		var start = _.indexOf(points, corners[a-1]);
		var end = _.indexOf(points, corners[a]);
		var segments = points.splice(start, end);
		var curve = false;
		for (var b in segments)
		{
		    var point;
		    var direction;
		    var distance = Skritter.fn.getDistanceToLineSegment(segments[0], segments[segments.length-1], segments[b]);
		    if (!curve || distance > curve) {
			point = segments[b];
			curve = distance;
			direction = Skritter.fn.getDirection(segments[0], point);
		    }
		}
		deviationPoints.push(point);
	    }
	    return deviationPoints;
	},
		
	getSubStrokeCount: function() {
	    return this.get('corners').length - 1;
	},
		
	isLine: function() {
	    if (this.get('corners') > 2)
		return true;
	    return false;
	},
		
	isValid: function() {
	    var point1 = this.get('points')[0];
	    var point2 = this.get('points')[this.get('points').length-1];
	    if (!point1 || !point2)
		return false;
	    var distance = getDistance(point1, point2);
	    if (distance < 20)
		return false;
	    return true;
	}
	
    });
    
    return CanvasStroke;
});