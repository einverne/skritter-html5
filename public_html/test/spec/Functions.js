/**
 * @param Functions
 * @author Joshua McFarland
 */
define([
    'Functions'
], function(Functions) {
    var points = [
        {x: 5, y: 5},
        {x: 10, y: 10},
        {x: 20, y: 20}
    ];

    describe('Functions', function() {
        describe('getAngle', function() {
            var angle = Functions.getAngle(points);
            it('should be a number equal to or greater than 0', function() {
                expect(angle).toBeGreaterThan(-1);
                expect(angle).toEqual(jasmine.any(Number));
            });
        });
        describe('getBoundingRectangle', function() {
            var rectangle = Functions.getBoundingRectangle(points, 100, 100, 5);
            it('should be an object', function() {
                expect(rectangle).toEqual(jasmine.any(Object));
            });
            it('should contain numerical values greater than 0 for x, y, w, h', function() {
                expect(rectangle.x).toEqual(jasmine.any(Number));
                expect(rectangle.x).toBeGreaterThan(-1);
                expect(rectangle.y).toEqual(jasmine.any(Number));
                expect(rectangle.y).toBeGreaterThan(-1);
                expect(rectangle.w).toEqual(jasmine.any(Number));
                expect(rectangle.w).toBeGreaterThan(-1);
                expect(rectangle.h).toEqual(jasmine.any(Number));
                expect(rectangle.h).toBeGreaterThan(-1);
            });
            it('should contain an object for value c with two numerical x and y values greater than 0', function() {
                expect(rectangle.c).toEqual(jasmine.any(Object));
                expect(rectangle.c.x).toEqual(jasmine.any(Number));
                expect(rectangle.c.x).toBeGreaterThan(-1);
                expect(rectangle.c.y).toEqual(jasmine.any(Number));
                expect(rectangle.c.y).toBeGreaterThan(-1);
            });
        });
        describe('getDistance', function() {
            var distance = Functions.getDistance(points[0], points[points.length - 1]);
            it('should be a number equal to or greater than 0', function() {
                expect(distance).toBeGreaterThan(-1);
                expect(distance).toEqual(jasmine.any(Number));
            });
        });
        describe('getLineDeviation', function() {
            var deviation = Functions.getLineDeviation(points[0], points[points.length - 1], {x: 100, y: 100});
            it('should be a number equal to or greater than 0', function() {
                expect(deviation).toBeGreaterThan(-1);
                expect(deviation).toEqual(jasmine.any(Number));
            });

        });
        describe('getUnixTime', function() {
            var timeMilliseconds = Functions.getUnixTime(true);
            var timeSeconds = Functions.getUnixTime(false);
            it('should be a number equal to or greater than 0', function() {
                expect(timeSeconds).toBeGreaterThan(-1);
                expect(timeSeconds).toEqual(jasmine.any(Number));
                expect(timeMilliseconds).toBeGreaterThan(-1);
                expect(timeMilliseconds).toEqual(jasmine.any(Number));
            });
            it('should return milliseconds if set true', function() {
                expect(timeMilliseconds).toBeGreaterThan(timeSeconds);
            });
            it('should not return milliseconds if false or undefined', function() {
                expect(timeSeconds).toBeLessThan(timeMilliseconds);
            });
        });
        describe('maskText', function() {
            var masked = Functions.maskCharacters(1234512345, 12, 9);
            it('should be a string', function() {
                expect(masked).toEqual(jasmine.any(String));
            });
            it('should contain exactly 2 of the number 9', function() {
                expect(masked.split('9').length - 1).toEqual(4);
            });
        });
        describe('pad', function() {
            var padded = Functions.pad(5, 1, 10);
            it('should be a string', function() {
                expect(padded).toEqual(jasmine.any(String));
            });
            it('should contain exactly 9 of the number 1', function() {
                expect(padded.split('1').length - 1).toEqual(9);
            });
        });
    });
});