define([
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'backbone'
], function(CanvasCharacter, CanvasStroke) {
    var Skritter = window.skritter;
   
    var StudyVocab = Backbone.Model.extend({
	
	getCanvasCharacters: function(index) {
	    index = (index) ? index : 0;
	    var characters = [];
	    
	    var rune = this.getCharacterAt(index);
	    var variations = Skritter.studyStrokes.findWhere({ rune:rune });
	    if (!variations)
		return false;
	    
	    variations = variations.get('strokes');
	    for (var a in variations)
	    {
		var character = new CanvasCharacter();
		var strokes = variations[a];
		var position = 1;
		for (var b in strokes)
		{
		    var stroke = new CanvasStroke();
		    var bitmapId = parseInt(strokes[b][0]);
		    var params = Skritter.studyParams.where({ bitmapId:bitmapId });
		    stroke.set('id', position + '|' + bitmapId);
		    stroke.set('rune', rune);
		    stroke.set('variation', parseInt(a));
		    stroke.set('position', position);
		    stroke.set('bitmapId', bitmapId);
		    stroke.set('studyData', _.clone(strokes[b]));
		    stroke.set('studyParams', params);
		    
		    //adjusts the position for double strokes
		    if (params[0].has('contains'))
			position++;
		    position++;
		    
		    character.add(stroke);
		}
		characters.push(character);
	    }
	    return characters;
	},
		
	getCanvasTones: function(index) {
	    index = (index) ? index : 0;
	    var characters = [];
	    
	    var rune = this.getCharacterAt(index);
	    //todo: fix this to include multiple pinyin answers
	    var tones = [];
	    var tone = this.getPinyinAt(index).tone;
	    for (var i in tone)
	    {
		tones.push('tone' + tone[i]);
	    }
	    var variations = Skritter.studyStrokes.findWhere({ rune:tones[0] });
	    if (!variations)
		return false;
	    
	    variations = variations.get('strokes');
	    for (var a in variations)
	    {
		var character = new CanvasCharacter();
		var strokes = variations[a];
		for (var b in strokes)
		{
		    var stroke = new CanvasStroke();
		    var bitmapId = parseInt(strokes[b][0]);
		    stroke.set('id', (parseInt(b)+1)+'|'+parseInt(bitmapId));
		    stroke.set('rune', rune);
		    stroke.set('variation', parseInt(a));
		    stroke.set('position', parseInt(b)+1);
		    stroke.set('bitmapId', bitmapId);
		    stroke.set('studyData', _.clone(strokes[b]));
		    stroke.set('studyParams', Skritter.studyParams.where({ bitmapId:bitmapId })).clone();
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
		return { syllable:syllable, tone:tone };
	    }
	    var syllable = syllable.split(/\d+/g);
	    var tone = _.without(tone.split(/[a-z]+/g), '');
	    return { syllable:syllable[index], tone:tone[index] };
	},
	
	getWritingDisplayAt: function(index) {
	    var element = '';
	    for (var i=0; i < this.getCharacterCount(); i++)
	    {
		if (index > i) {
		    element += "<div class='prompt-display'>" + this.getCharacterAt(i) + "</div>";
		} else {
		    element += "<div class='prompt-hidden'></div>";
		}
	    }
	    return element;
	},
		
	getReadingDisplayAt: function(index) {
	    var element = '';
	    for (var i=0; i < this.getCharacterCount(); i++)
	    {
		if (index > i) {
		    element += "<div class='prompt-display'>" + this.getPinyinAt(i).syllable + "</div>";
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