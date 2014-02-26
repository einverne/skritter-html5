/**
 * @module Skritter
 * @submodule Tests
 * @param SimpTradMap
 * @author Joshua McFarland
 */
define([
    'functions/SimpTradMap'
], function(SimpTradMap) {
    describe('SimpTradMap', function() {
        describe('fromBase', function() {
            it('should convert zh-们-1 to the traditional form 們', function() {
                expect(SimpTradMap.fromBase('zh-们-1')).toBe('們');
            });
            it('should convert zh-呆-4 to the traditional form 騃', function() {
                expect(SimpTradMap.fromBase('zh-呆-3')).toBe('騃');
            });
        });
        describe('toBase', function() {
            it('should convert 我们 to the simplified base zh-我们-0', function() {
                expect(SimpTradMap.toBase('我们')).toBe('zh-我们-0');
            });
            it('should convert 我們 to the simplified base zh-我們-1', function() {
                expect(SimpTradMap.toBase('我們')).toBe('zh-我们-1');
            });
            it('should convert 鑑绅 to the simplified base zh-鉴绅-2 ', function() {
                expect(SimpTradMap.toBase('鑑绅')).toBe('zh-鉴绅-2');
            });
        });
    });
});