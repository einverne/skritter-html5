/**
 * @param PinyinConverter
 * @author Joshua McFarland
 */
define([
    'PinyinConverter'
], function(PinyinConverter) {
    describe('PinyinConverter', function() {
        var numerical = 'shang4hai3';
        var tone = 'shànghǎi';
        describe('toNumber', function() {
            it('should replace shànghǎi with shang4hai3', function() {
                expect(PinyinConverter.toNumber(tone)).toEqual(numerical);
            });
        });
        describe('toTone', function() {
            it('should replace shang4hai3 with shànghǎi', function() {
                expect(PinyinConverter.toTone(numerical)).toEqual(tone);
            });
        });
    });
});