/*
 * 
 * Model: StudyVocab
 * 
 * Created By: Joshua McFarland
 * 
 * Properties
 * id
 * writing
 * reading
 * definitions
 * customDefinition
 * lang
 * audio
 * rareKanji
 * toughness
 * toughnessString
 * mnemonic
 * starred
 * style
 * changed
 * bannedParts
 * containedVocabIds
 * heisigDefinition
 * sentenceId
 * topMnemonic
 * 
 */
define([
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'backbone'
], function(CanvasCharacter, CanvasStroke) {

    var StudyVocab = Backbone.Model.extend({
	
	getCanvasCharacters: function(index, part) {
	    part = (part) ? part : 'rune';
	    index = (index) ? index : 0;
	    var characters = [];
	    
	    //loads the selected characters stroke data
	    var rune = this.getCharacterAt(index);
	    
	    var variations = [];
	    if (part === 'rune') {
		variations = Skritter.study.strokes.findWhere({rune: rune}).get('strokes');
	    } else {
		var tones = this.getPinyinAt(index).tone.split(',');
		for (var t in tones)
		{
		    var tone = 'tone' + tones[t].replace(' ', '');
		    variations.push(Skritter.study.strokes.findWhere({rune: tone}).get('strokes'));
		}
	    }
	    
	    //loops through the possible alternate variations
	    for (var v in variations)
	    {
		var character = new CanvasCharacter();
		var strokes = variations[v];
		var position = 1;
		for (var s in strokes)
		{
		    var stroke = new CanvasStroke();
		    var bitmapId = parseInt(strokes[s][0]);
		    var params = Skritter.study.params.findWhere({bitmapId: bitmapId});	
		    stroke.set('bitmap', new createjs.Bitmap(Skritter.assets.getStroke(bitmapId).src));
		    stroke.set('bitmapId', bitmapId);
		    stroke.set('data', strokes[s]);
		    stroke.set('id', position + '|' + bitmapId);
		    stroke.set('part', part);
		    stroke.set('position', position);
		    stroke.set('rune', rune);
		    
		    //adjusts the relative position for double strokes
		    if (params.has('contains'))
			position++;
		    position++;
		    
		    character.add(stroke);
		}
		characters.push(character);
	    }
	    
	    return characters;
	},
		
	getCharacterAt: function(index) {
	    return this.get('writing').split('')[index];
	},
		
	getCharacterCount: function() {
	    return this.get('writing').split('').length;
	},
		
	getPinyinAt: function(index) {
	    index = (index) ? index : 0;
	    var syllable = _.clone(this.get('reading'));
	    var tone = _.clone(this.get('reading'));
	    if (this.getCharacterCount() === 1) {
		var syllable = syllable.replace(/[0-9]+/g, '');
		var tone = tone.replace(/[a-z]+/g, '');
		return {syllable: syllable, tone: tone};
	    }
	    var syllable = syllable.split(/\d+/g);
	    var tone = _.without(tone.split(/[a-z]+/g), '');
	    return {syllable: syllable[index], tone: tone[index]};
	},
		
	getReadingDisplayAt: function(index) {
	    var element = '';
	    for (var i = 0; i < this.getCharacterCount(); i++)
	    {
		if (index > i) {
		    element += "<div class='prompt-display'>" + this.getPinyinAt(i).syllable + "</div>";
		} else {
		    element += "<div class='prompt-hidden'></div>";
		}
	    }
	    return element;
	},
		
	getSentence: function() {
	    var sentence = Skritter.study.sentences.findWhere({id: this.get('sentenceId')});
	    return (sentence) ? sentence : null;
	},
		
	getWritingDisplayAt: function(index) {
	    var element = '';
	    for (var i = 0; i < this.getCharacterCount(); i++)
	    {
		if (index > i) {
		    element += "<div class='prompt-display'>" + this.getCharacterAt(i) + "</div>";
		} else {
		    element += "<div class='prompt-hidden'></div>";
		}
	    }
	    return element;
	},
		
	hasCharacterAt: function(index) {
	    if (index >= this.getCharacterCount())
		return false;
	    return true;
	}

    });


    return StudyVocab;
});