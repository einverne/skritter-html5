/**
 * @module Skritter
 * @submodule Tests
 * @param Vocab
 * @author Joshua McFarland
 */
define([
    'models/study/Vocab'
], function(Vocab) {
    var jaTest = new Vocab({"lang": "ja", "rareKanji": false, "reading": "せきがでる", "toughness": 10, "containedVocabIds": ["ja-出-0"], "definitions": {"en": "to cough"}, "toughnessString": "hardest", "writing": "せきが出る", "starred": false, "audio": "/sounds?file=%E3%81%9B%E3%81%8D%E3%81%8C%E3%81%A7%E3%82%8B_%E3%81%9B%E3%81%8D%E3%81%8C%E5%87%BA%E3%82%8B.mp3", "id": "ja-せきが出る-0"});
    describe('Vocab', function() {
        describe('characters', function() {
            it('should only return 出 from the writing せきが出る', function() {
                expect(jaTest.characters()).toEqual(['出']);
            });
        });
        describe('containedItemIds', function() {
            it('jaTest should return an array with bschwind-ja-出-0-rune', function() {
                expect(jaTest.containedItemIds('defn')).toEqual(['bschwind-ja-出-0-defn']);
                expect(jaTest.containedItemIds('rune')).toEqual(['bschwind-ja-出-0-rune']);
            });
        });
        describe('count', function() {
            it('should return 1 for the writing せきが出る', function() {
                expect(jaTest.count()).toBe(1);
            });
            it('should return 4 for the writing 好好学习', function() {
                expect(new Vocab({"containedVocabIds": ["zh-好-0", "zh-好-0", "zh-学-0", "zh-习-0"]}).count()).toEqual(4);
            });
            it('should return 1 for single character writings', function() {
                expect(new Vocab({"writing": "好"}).count()).toEqual(1);
            });
            it('should return 0 for writings that are all kana', function() {
                expect(new Vocab({"writing": "かっこいい"}).count()).toEqual(0);
            });
            it('should return 0 for single kana writings', function() {
                expect(new Vocab({"writing": "か"}).count()).toEqual(0);
            });
        });
    });
});