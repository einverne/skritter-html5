/*
 * 
 * View: PromptRune
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'PinyinConverter',
    'view/subview/Canvas',
    'view/subview/GradingButtons',
    'require.text!template/prompt/rune.html',
    'jquery.hammer',
    'backbone'
], function(PinyinConverter, CanvasView, GradingButtonsView, templateRune) {
    var Skritter = window.skritter;
    
    var PromptRuneView = Backbone.View.extend({
	
	initialize: function() {
	    PromptRuneView.canvas;
	    PromptRuneView.complete = false;
	    PromptRuneView.definition;
	    PromptRuneView.grade = 3;
	    PromptRuneView.gradingButtons = new GradingButtonsView();
	    PromptRuneView.position;
	    PromptRuneView.reading;
	    PromptRuneView.sentence;
	    PromptRuneView.vocab;
	    PromptRuneView.writing;
	},
	
	template: _.template(templateRune),
	
	render: function() {
	    this.$el.html(this.template);
	    
	    if (PromptRuneView.writing)
		$(this.$el.selector + ' #rune #writing').html(PromptRuneView.writing);
	    if (PromptRuneView.reading)
		$(this.$el.selector + ' #rune #reading').html(PromptRuneView.reading);
	    if (PromptRuneView.definition)
		$(this.$el.selector + ' #rune #definition').html(PromptRuneView.definition);
	    if (PromptRuneView.canvas)
		$(this.$el.selector + ' #rune #sentence').html(Skritter.fn.maskText(PromptRuneView.sentence, PromptRuneView.vocab[0].get('writing')));
	    if (PromptRuneView.canvas)
		PromptRuneView.canvas.setElement($(this.$el.selector + ' #rune #canvas-area')).render();
	    if (PromptRuneView.complete) {
		PromptRuneView.canvas.disable();
		this.toggleGradingButtons();
	    }
	    
	    Skritter.frame.study();
	    return this;
	},
	
	handleGradeSelected: function(grade) {
	    PromptRuneView.grade = grade;
	    this.triggerComplete();
	},
	
	handleWritingComplete: function(grade) {
	    PromptRuneView.canvas.disable();
	    PromptRuneView.complete = true;
	    PromptRuneView.grade = grade;
	    $(this.$el.selector + ' #rune #canvas-area').hammer().one('swipeleft.PromptRuneView', _.bind(this.triggerComplete, this));
	    $(this.$el.selector + ' #rune #canvas-area').hammer().one('tap.PromptRuneView', _.bind(this.triggerComplete, this));
	    this.show();
	    this.toggleGradingButtons();
	},
		
	set: function(vocab, position) {
	    //starts the timer
	    Skritter.timer.start();
	    
	    PromptRuneView.vocab = vocab;
	    PromptRuneView.position = position;
	    
	    //set prompt variables
	    PromptRuneView.writing = PromptRuneView.vocab[0].getWritingDisplayAt(PromptRuneView.position);
	    PromptRuneView.reading = PinyinConverter.toTone(PromptRuneView.vocab[0].get('reading'));
	    PromptRuneView.definition = PromptRuneView.vocab[0].get('definitions').en;
	    if (Skritter.studySentences.findWhere({id:PromptRuneView.vocab[0].get('sentenceId')}).get('writing'));
		PromptRuneView.sentence = Skritter.studySentences.findWhere({id:PromptRuneView.vocab[0].get('sentenceId')}).get('writing');
		
	    $(this.$el.selector + ' #rune #writing').html(PromptRuneView.writing);
	    $(this.$el.selector + ' #rune #reading').html(PromptRuneView.reading);
	    $(this.$el.selector + ' #rune #definition').html(PromptRuneView.definition);
	    $(this.$el.selector + ' #rune #sentence').html(Skritter.fn.maskText(PromptRuneView.sentence, PromptRuneView.vocab[0].get('writing')));
	    PromptRuneView.canvas = new CanvasView();
	    PromptRuneView.canvas.setElement($(this.$el.selector + ' #rune #canvas-area')).render();
	    PromptRuneView.canvas.setTargets(PromptRuneView.vocab[0].getCanvasCharacters(PromptRuneView.position));
	    
	    //events
	    self = this;
	    this.listenToOnce(PromptRuneView.canvas, 'complete:character', this.handleWritingComplete);
	    $(this.$el.selector + ' #rune #canvas-area').hammer().on('doubletap', function() {
		PromptRuneView.canvas.showTarget(0.2);
	    });
	    $(this.$el.selector + ' #rune #canvas-area').hammer().on('hold', function() {
		PromptRuneView.canvas.clearAll(true);
	    });
	},
		
	show: function() {
	    //stops the time
	    Skritter.timer.stop();
	    
	    //display the new writing position display
	    PromptRuneView.position++;
	    $(this.$el.selector + ' #rune #writing').html(PromptRuneView.vocab[0].getWritingDisplayAt(PromptRuneView.position));
	    
	    //show the hidden sentence vocabs only if the last position of the prompt
	    if (PromptRuneView.position >= PromptRuneView.vocab[0].getCharacterCount())
		$(this.$el.selector + ' #rune #sentence').html(PromptRuneView.sentence);
	    
	    //events
	    this.listenToOnce(PromptRuneView.gradingButtons, 'selected', this.handleGradeSelected);
	},
		
	toggleGradingButtons: function() {
	    //display the grading buttons
	    PromptRuneView.gradingButtons.setElement($(this.$el.selector + ' #rune #grading-buttons')).render();
	    PromptRuneView.gradingButtons.select(PromptRuneView.grade);
	},
		
	triggerComplete: function() {
	    console.log('prompt complete');
	    this.trigger('complete', PromptRuneView.grade);
	}
	
    });

    return PromptRuneView;
});