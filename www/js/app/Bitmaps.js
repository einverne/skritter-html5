/*
 * 
 * Module: Bitmaps
 * 
 * Created By: Joshua McFarland
 * 
 */
define(function() {
    
    var bitmaps = {
	"0": {"contains": [], "offsetAngle": 0, "offsetPosition": {"x": 0, "y": 0}, "params": [
		{"corners": [{"x": 26, "y": 51}, {"x": 356, "y": 12}], "deviations": [{"x": 162, "y": 39}], "feedback": "none"},
		{"corners": [{"x": 26, "y": 51}, {"x": 356, "y": 12}], "deviations": [{"x": 162, "y": 39}], "feedback": "testing"}
	    ]},
	"1": {"contains": [], "offsetAngle": 0, "offsetPosition": {"x": 0, "y": 0}, "params": [
		{"corners": [{"x": 19, "y": 46}, {"x": 270, "y": 15}], "deviations": [{"x": 159, "y": 25}], "feedback": "none"}
	    ]},
	"67": {"contains": [], "offsetAngle": 0, "offsetPosition": {"x": 0, "y": 0}, "params": [
	    {"corners": [{"x": 174, "y": 16}, {"x": 15, "y": 134}], "deviations": [{"x": 128, "y": 70}]}
	]},
	"150": {"contains": [], "offsetAngle": 0, "offsetPosition": {"x": 0, "y": 0}, "params": [
	    {"corners": [{"x": 77, "y": 24}, {"x": 70.96767480603364, "y": 241.03232519396636}, {"x": 18, "y": 208}], "deviations": [{"x": 77, "y": 144}, {"x": 64, "y": 242}]}
	]},
	"205": {"contains": [], "offsetAngle": 0, "offsetPosition": {"x": 0, "y": 0}, "params": [
	    {"bitmapId": 205, "corners": [{"x": 23, "y": 21}, {"x": 192.6425252468284, "y": 387.64252524682837}, {"x": 204, "y": 343}], "deviations": [{"x": 73, "y": 266}, {"x": 200, "y": 370}]}
	]},
	"356": {"contains": [111, 370], "offsetAngle": 0, "offsetPosition": {"x": 0, "y": 0}, "params": [
		{"corners": [{"x": 9, "y": 37}, {"x": 89.80876218099775, "y": 18}, {"x": 85.10842957527841, "y": 102.89157042472159}, {"x": 30, "y": 126}], "deviations": [{"x": 35, "y": 33}, {"x": 92, "y": 68}, {"x": 41, "y": 122}]}

	]}
    };
    
    var getParams = function() {
	var params = [];
	for (var bitmapId in bitmaps)
	{
	    var contains = bitmaps[bitmapId].contains;
	    var offsetAngle = bitmaps[bitmapId].offsetAngle;
	    var offsetPosition = bitmaps[bitmapId].offsetPosition;
	    var bitmapParams = bitmaps[bitmapId].params;
	    for (var i in bitmapParams)
	    {
		bitmapParams[i]['contains'] = contains;
		bitmapParams[i]['bitmapId'] = bitmapId;
		bitmapParams[i]['offsetAngle'] = offsetAngle;
		bitmapParams[i]['offsetPosition'] = offsetPosition;
	    }
	    params = params.concat(bitmapParams);
	}
	return params;
    };
    
    var toJSON = function() {
	return bitmaps;
    };
    
    
    return {
	getParams: getParams,
	toJSON: toJSON
    };
});