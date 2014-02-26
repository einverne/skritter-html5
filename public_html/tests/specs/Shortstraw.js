/**
 * @module Skritter
 * @submodule Tests
 * @param Shortstraw
 * @author Joshua McFarland
 */
define([
    'functions/Shortstraw'
], function(Shortstraw) {
    var shortstraw = new Shortstraw();
    var oneTurningPoint = [{"x": 128, "y": 78}, {"x": 128, "y": 79}, {"x": 135, "y": 79}, {"x": 189, "y": 79}, {"x": 252, "y": 79}, {"x": 296, "y": 79}, {"x": 331, "y": 79}, {"x": 346, "y": 79}, {"x": 358, "y": 79}, {"x": 367, "y": 79}, {"x": 372, "y": 79}, {"x": 373, "y": 81}, {"x": 373, "y": 88}, {"x": 373, "y": 99}, {"x": 371, "y": 114}, {"x": 368, "y": 132}, {"x": 363, "y": 152}, {"x": 362, "y": 163}, {"x": 362, "y": 166}, {"x": 362, "y": 166}];
    var fourTurningPoints = [{"x": 59, "y": 72}, {"x": 64, "y": 72}, {"x": 93, "y": 72}, {"x": 128, "y": 72}, {"x": 149, "y": 72}, {"x": 150, "y": 73}, {"x": 150, "y": 82}, {"x": 143, "y": 110}, {"x": 137, "y": 142}, {"x": 133, "y": 174}, {"x": 131, "y": 194}, {"x": 130, "y": 198}, {"x": 131, "y": 199}, {"x": 157, "y": 198}, {"x": 209, "y": 198}, {"x": 283, "y": 198}, {"x": 315, "y": 198}, {"x": 317, "y": 195}, {"x": 316, "y": 170}, {"x": 316, "y": 136}, {"x": 316, "y": 107}, {"x": 316, "y": 91}, {"x": 320, "y": 87}, {"x": 353, "y": 82}, {"x": 395, "y": 82}, {"x": 441, "y": 82}, {"x": 448, "y": 82}];
    describe('Shortstraw', function() {
        describe('process', function() {
            it('should return an empty array for for strokes with no corners', function() {
                expect(shortstraw.process([])).toEqual([]);
            });
            it('should return 3 corners for strokes with 1 turning point', function() {
                expect(shortstraw.process(oneTurningPoint).length).toBe(3);
            });
            it('should return 6 corners for strokes with 4 turning points', function() {
                expect(shortstraw.process(fourTurningPoints).length).toBe(6);
            });
        });
    });
});