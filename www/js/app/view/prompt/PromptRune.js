/*
 * 
 * View: PromptRune
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'require.text!template/prompt-rune.html',
    'PinyinConverter',
    'view/prompt/GradingButtons',
    'view/prompt/PromptCanvas',
    'jquery.hammer',
    'backbone'
], function(templateRune, PinyinConverter, GradingButtons, PromptCanvas) {
    
    var PromptRune = Backbone.View.extend({
	
	initialize: function() {
	    PromptRune.canvas = new PromptCanvas({grid: true});
	    PromptRune.complete = false;
	    PromptRune.definition;
	    PromptRune.grade = 3;
	    PromptRune.gradingButtons = new GradingButtons();
	    PromptRune.position = 0;
	    PromptRune.reading;
	    PromptRune.reviewTime = 0;
	    PromptRune.sentence;
	    PromptRune.startTime = 0;
	    PromptRune.thinkingTime = 0;
	    PromptRune.vocab;
	    PromptRune.writing;
	},
		
	template: templateRune,
		
	render: function() {
	    this.$el.html(this.template);
	    this.resize();
	    return this;
	},
	
	handleDoubleTap: function() {
	    PromptRune.canvas.setGrade(1);
	    PromptRune.canvas.showTarget();
	},
	
	handleGradeSelected: function(grade) {
	    PromptRune.grade = grade;
	    this.triggerComplete();
	},
		
	handleHold: function() {
	    PromptRune.canvas.clear();
	    PromptRune.canvas.enable();
	    PromptRune.canvas.remove();
	    PromptRune.gradingButtons.remove();
	    this.$('#input-canvas').hammer().off('swipeleft.PromptRune');
	    this.showPrompt();
	},
		
	handleSwipeLeft: function() {
	    this.triggerComplete();
	},
		
	handleWritingComplete: function(grade) {
	    PromptRune.canvas.disable();
	    PromptRune.complete = true;
	    PromptRune.gradingButtons.setElement($('#writing-area')).render();
	    PromptRune.gradingButtons.select(grade);
	    PromptRune.grade = grade;
	    PromptRune.reviewTime = Skritter.timer.getReviewTime();
	    PromptRune.thinkingTime = Skritter.timer.getThinkingTime();
	    this.listenToOnce(PromptRune.gradingButtons, 'selected', this.handleGradeSelected);
	    this.showAnswer();
	},
	
	resize: function() {
	    var appHeight = Skritter.settings.get('appHeight');
	    var toolbarHeight = $('#toolbar-container').height();
	    var canvasSize = Skritter.settings.get('canvasSize');
	    this.$('#top').height(appHeight - toolbarHeight - canvasSize);
	    this.$('#top').width(canvasSize);
	},
	
	showAnswer: function() {
	    Skritter.timer.stop();
	    PromptRune.position++;
	    this.$('#rune #writing').html(PromptRune.vocab.getWritingDisplayAt(PromptRune.position));
	    if (PromptRune.position >= PromptRune.vocab.getCharacterCount())
		this.$('#rune #sentence').html(PromptRune.sentence);
	    
	    //events and listeners
	    this.$('#input-canvas').hammer().one('swipeleft.PromptRune', _.bind(this.handleSwipeLeft, this));
	},
		
	set: function(vocab, position) {
	    Skritter.timer.setReviewLimit(30000);
	    Skritter.timer.setThinkingLimit(15000);
	    PromptRune.startTime = Skritter.fn.getUnixTime();
	    PromptRune.canvas.setTargets(vocab.getCanvasCharacters(position, 'rune'), true);
	    PromptRune.definition = vocab.get('definitions')[Skritter.user.get('sourceLang')];
	    PromptRune.position = position;
	    PromptRune.reading = PinyinConverter.toTone(vocab.get('reading'));
	    PromptRune.sentence = (vocab.getSentence()) ? vocab.getSentence().get('writing') : null;
	    PromptRune.writing = vocab.getWritingDisplayAt(position);
	    PromptRune.vocab = vocab;
	},
			
	showPrompt: function() {
	    Skritter.timer.start();
	    this.$('#rune #definition').html(PromptRune.definition);
	    this.$('#rune #reading').html(PromptRune.reading);
	    if (PromptRune.sentence) 
		this.$('#rune #sentence').html(Skritter.fn.maskText(PromptRune.sentence, PromptRune.vocab.get('writing')));
	    this.$('#rune #writing').html(PromptRune.writing);
	    
	    //canvas element
	    PromptRune.canvas.setElement(this.$('#rune #bottom')).render();
	    if (PromptRune.position === 0) {
		PromptRune.vocab.play();
		PromptRune.canvas.displayMessage("Draw the character");
	    }
	    
	    //events and listeners
	    this.listenToOnce(PromptRune.canvas, 'writing:complete', this.handleWritingComplete);
	    this.$('#writing-area').hammer().on('doubletap.PromptRune', this.handleDoubleTap);
	    this.$('#input-canvas').hammer().one('hold.PromptRune', _.bind(this.handleHold, this));
	},
		
	triggerComplete: function() {
	    this.trigger('prompt:complete', {
		grade: PromptRune.grade,
		reviewTime: PromptRune.reviewTime,
		startTime: PromptRune.startTime,
		thinkingTime: PromptRune.thinkingTime
	    });
	}
	
    });
    
    
    return PromptRune;
});