/*
 * 
 * Module: PinyinConverter
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Utility used to convert between pinyin number and tone formats.
 * 
 * Functions:
 * toTone: converts from a numerical representation to tone marks
 * toNumberical: convert from tone marks to a numerical representation
 * 
 */
define(function() {
    
    var mapping = {
	'ang1': 'āng',
	    'ang2': 'áng',
	    'ang3': 'ǎng',
	    'ang4': 'àng',
	    'eng1': 'ēng',
	    'eng2': 'éng',
	    'eng3': 'ěng',
	    'eng4': 'èng',
	    'ing1': 'īng',
	    'ing2': 'íng',
	    'ing3': 'ǐng',
	    'ing4': 'ìng',
	    'ong1': 'ōng',
	    'ong2': 'óng',
	    'ong3': 'ǒng',
	    'ong4': 'òng',
	    'an1': 'ān',
	    'an2': 'án',
	    'an3': 'ǎn',
	    'an4': 'àn',
	    'en1': 'ēn',
	    'en2': 'én',
	    'en3': 'ěn',
	    'en4': 'èn',
	    'in1': 'īn',
	    'in2': 'ín',
	    'in3': 'ǐn',
	    'in4': 'ìn',
	    'un1': 'ūn',
	    'un2': 'ún',
	    'un3': 'ǔn',
	    'un4': 'ùn',
	    'er2': 'ér',
	    'er3': 'ěr',
	    'er4': 'èr',
	    'ao1': 'āo',
	    'ao2': 'áo',
	    'ao3': 'ǎo',
	    'ao4': 'ào',
	    'ou1': 'ōu',
	    'ou2': 'óu',
	    'ou3': 'ǒu',
	    'ou4': 'òu',
	    'ai1': 'āi',
	    'ai2': 'ái',
	    'ai3': 'ǎi',
	    'ai4': 'ài',
	    'ei1': 'ēi',
	    'ei2': 'éi',
	    'ei3': 'ěi',
	    'ei4': 'èi',
	    'a1': 'ā',
	    'a2': 'á',
	    'a3': 'ǎ',
	    'a4': 'à',
	    'e1': 'ē',
	    'e2': 'é',
	    'e3': 'ě',
	    'e4': 'è',
	    'i1': 'ī',
	    'i2': 'í',
	    'i3': 'ǐ',
	    'i4': 'ì',
	    'o1': 'ō',
	    'o2': 'ó',
	    'o3': 'ǒ',
	    'o4': 'ò',
	    'u1': 'ū',
	    'u2': 'ú',
	    'u3': 'ǔ',
	    'u4': 'ù',
	    'v1': 'ǖ',
	    'v2': 'ǘ',
	    'v3': 'ǚ',
	    'v4': 'ǜ',
	    'v': 'ü'
    };
    
    var number = function(text) {
	for (var key in mapping)
	{
	    var expression = new RegExp(mapping[key], 'g');
	    text = text.replace(expression, key);
	}
	return text;
    };
    
    var tone = function(text) {
	text = text.replace('5', '');
	for (var key in mapping)
	{
	    var expression = new RegExp(key, 'g');
	    text = text.replace(expression, mapping[key]);
	}
	return text;
    };
    
    return {
	toNumber: number,
	toTone: tone
    };
});