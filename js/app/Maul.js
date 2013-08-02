/*
 * 
 * Module: Maul
 * 
 * Probably more like Darth Maul to me, but used to help normalize character inflation and tweening.
 * 
 */
define(function() {
    
    function Maul(studyData, bitmap, canvasWidth) {
	studyData = _.clone(studyData);
	var n = studyData[0];
	var x = studyData[1] * canvasWidth;
	var y = studyData[2] * canvasWidth;
	var width = studyData[3] * canvasWidth;
	var height = studyData[4] * canvasWidth;
	var rotation = -studyData[5];
	
	var inflatedStudyData = {
	    bitmapId: n,
	    x: x,
	    y: y,
	    regX: (bitmap.w / 2) * width / bitmap.w,
	    regY: (bitmap.h / 2) * height / bitmap.h,
	    scaleX: width / bitmap.w,
	    scaleY: height / bitmap.h,
	    width: width,
	    height: height,
	    rotation: rotation
	};
	
	return inflatedStudyData;
    }
    
    return Maul;
});