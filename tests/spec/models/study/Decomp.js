define([
    'models/study/Decomp'
], function(Decomp) {
    describe('Decomp', function() {
        var decomp;

        beforeEach(function() {
            decomp = new Decomp({reading: 'yi1'});
        });

        it('should get reading', function() {
            expect(decomp.getReading()).toEqual('yī');
        });
    });
});