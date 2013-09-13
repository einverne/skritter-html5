/*
 * 
 * View: PromptTone
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/prompt-tone.html',
    'PinyinConverter',
    'view/prompt/GradingButtons',
    'view/prompt/PromptCanvas',
    'jquery.hammer',
    'backbone'
], function(templateTone, PinyinConverter, GradingButtons, PromptCanvas) {
    
    var PromptTone = Backbone.View.extend({
	
	initialize: function() {
	    PromptTone.canvas = new PromptCanvas({grid: false});
	    PromptTone.complete = false;
	    PromptTone.definition;
	    PromptTone.grade = 3;
	    PromptTone.gradingButtons = new GradingButtons();
	    PromptTone.position = 0;
	    PromptTone.reading;
	    PromptTone.reviewTime = 0;
	    PromptTone.sentence;
	    PromptTone.startTime = 0;
	    PromptTone.thinkingTime = 0;
	    PromptTone.vocab;
	    PromptTone.writing;
	},
	
	template: templateTone,
		
	render: function() {
	    this.$el.html(this.template);
	    this.resize();
	    return this;
	},
	
	handleDoubleTap: function() {
	    PromptTone.canvas.setGrade(1);
	    PromptTone.canvas.showTarget();
	},
	
	handleGradeSelected: function(grade) {
	    PromptTone.grade = grade;
	    this.triggerComplete();
	},
		
	handleHold: function() {
	    PromptTone.canvas.clear();
	    PromptTone.canvas.enable();
	    PromptTone.canvas.remove();
	    PromptTone.gradingButtons.remove();
	    this.$('#input-canvas').hammer().off('swipeleft.PromptTone');
	    this.showPrompt();
	},
		
	handleSwipeLeft: function() {
	    this.triggerComplete();
	},
		
	handleWritingComplete: function(grade) {
	    PromptTone.canvas.disable();
	    PromptTone.complete = true;
	    PromptTone.gradingButtons.setElement($('#writing-area')).render();
	    PromptTone.gradingButtons.select(grade);
	    PromptTone.grade = grade;
	    PromptTone.reviewTime = Skritter.timer.getReviewTime();
	    PromptTone.thinkingTime = Skritter.timer.getThinkingTime();
	    this.listenToOnce(PromptTone.gradingButtons, 'selected', this.handleGradeSelected);
	    this.showAnswer();
	},
			
	resize: function() {
	    var appHeight = Skritter.settings.get('appHeight');
	    var toolbarHeight = $('#toolbar-container').height();
	    var canvasSize = Skritter.settings.get('canvasSize');
	    this.$('#top').height(appHeight - toolbarHeight - canvasSize);
	    this.$('#top').width(canvasSize);
	},
	
	set: function(vocab, position) {
	    PromptTone.startTime = Skritter.fn.getUnixTime();
	    PromptTone.canvas.setTargets(vocab.getCanvasCharacters(position, 'tone'));
	    PromptTone.definition = vocab.get('definitions')[Skritter.user.get('sourceLang')];
	    PromptTone.position = position;
	    PromptTone.reading = vocab.getPinyinAt(position).syllable;
	    PromptTone.sentence = (vocab.getSentence()) ? vocab.getSentence().get('writing') : null;
	    PromptTone.writing = vocab.get('writing');
	    PromptTone.vocab = vocab;
	},
		
	showAnswer: function() {
	    Skritter.timer.stop();
	    PromptTone.position++;
	    this.$('#tone #reading').html(PinyinConverter.toTone(PromptTone.vocab.get('reading')));
	    
	    //events and listeners
	    this.$('#input-canvas').hammer().one('swipeleft.PromptTone', _.bind(this.handleSwipeLeft, this));
	},
		
	showPrompt: function() {
	    Skritter.timer.setReviewLimit(15000);
	    Skritter.timer.setThinkingLimit(10000);
	    Skritter.timer.start();
	    
	    this.$('#tone #definition').html(PromptTone.definition);
	    this.$('#tone #reading').html(PromptTone.reading);
	    this.$('#tone #writing').html(PromptTone.writing);
	    
	    //canvas element
	    PromptTone.canvas.setElement(this.$('#tone #bottom')).render();
	    if (PromptTone.position === 0)
		PromptTone.canvas.displayMessage("Draw the tone");
	    PromptTone.canvas.drawCharacter(PromptTone.vocab.getCharacterAt(PromptTone.position));
	    
	    //events and listeners
	    this.listenToOnce(PromptTone.canvas, 'writing:complete', this.handleWritingComplete);
	    this.$('#writing-area').hammer().on('doubletap.PromptTone', this.handleDoubleTap);
	    this.$('#input-canvas').hammer().one('hold.PromptTone', _.bind(this.handleHold, this));
	},
	
	triggerComplete: function() {
	    this.trigger('prompt:complete', {
		grade: PromptTone.grade,
		reviewTime: PromptTone.reviewTime,
		startTime: PromptTone.startTime,
		thinkingTime: PromptTone.thinkingTime
	    });
	}
    });
    
    
    return PromptTone;
});