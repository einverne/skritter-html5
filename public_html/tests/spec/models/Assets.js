define([
    'models/Assets'
], function(Assets) {
    describe('Assets', function() {
        var assets;

        beforeEach(function (){
            assets = new Assets();
        });
        it('should retrieve a stroke', function (){
            var stroke = assets.getStroke(0);
            expect(stroke).toEqual(jasmine.any(Object));
            expect(stroke.x).toEqual(0);
            expect(stroke.y).toEqual(0);
        });
        it('should throw exception if the stroke does not exist', function() {
            expect(assets.getStroke, -1).toThrow();
        });
    });
});