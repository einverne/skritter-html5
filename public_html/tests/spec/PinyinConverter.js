define([
    'PinyinConverter'
], function(PinyinConverter) {
    describe('PinyinConverter', function() {
        it('should convert tone marks to numbers', function() {
            expect(PinyinConverter.toNumber('zhōng guó')).toEqual('zhong1 guo2');
        });
        it('should convert tone numbers to marks', function() {
           expect(PinyinConverter.toTone('zhong1 guo2')).toEqual('zhōng guó'); 
        });
    });
});