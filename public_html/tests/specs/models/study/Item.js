/**
 * @module Skritter
 * @submodule Tests
 * @param Item
 * @author Joshua McFarland
 */
define([
    'models/study/Item'
], function(Item) {
    describe('Item', function() {
        describe('vocabId', function() {
            it('should return the first vocabId when reviews are even', function() {
                expect(new Item({"reviews": 0, "vocabIds": ["zh-习-0", "zh-习-1"]}).vocabId()).toEqual('zh-习-0');
            });
            it('should return the second vocabId when reviews are odd', function() {
                expect(new Item({"reviews": 1, "vocabIds": ["zh-习-0", "zh-习-1"]}).vocabId()).toEqual('zh-习-1');
            });
        });
    });
});