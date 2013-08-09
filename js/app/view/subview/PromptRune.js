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
	    PromptRuneView.canvas = new CanvasView();
	    PromptRuneView.grade = 3;
	    PromptRuneView.gradingButtons = new GradingButtonsView();
	    PromptRuneView.position;
	    PromptRuneView.sentence;
	    PromptRuneView.vocab;
	},
	
	template: _.template(templateRune),
	
	render: function() {
	    this.$el.html(this.template);
	    Skritter.frame.study();
	    return this;
	},
	
	handleGradeSelected: function(grade) {
	    PromptRuneView.grade = grade;
	    this.triggerComplete();
	},
	
	handleWritingComplete: function(grade) {
	    PromptRuneView.canvas.disable();
	    $(this.$el.selector + ' #rune #canvas-area').hammer().one('swipeleft.PromptRuneView', _.bind(this.triggerComplete, this));
	    $(this.$el.selector + ' #rune #canvas-area').hammer().one('tap.PromptRuneView', _.bind(this.triggerComplete, this));
	    this.show(grade);
	},
		
	set: function(vocab, position) {
	    //starts the timer
	    Skritter.timer.start();
	    
	    PromptRuneView.vocab = vocab;
	    PromptRuneView.position = position;
	    
	    //set the sentence only if one exists
	    if (Skritter.studySentences.findWhere({id:PromptRuneView.vocab[0].get('sentenceId')}).get('writing'));
		PromptRuneView.sentence = Skritter.studySentences.findWhere({id:PromptRuneView.vocab[0].get('sentenceId')}).get('writing');
		
	    $(this.$el.selector + ' #rune #writing').html(PromptRuneView.vocab[0].getWritingDisplayAt(PromptRuneView.position));
	    $(this.$el.selector + ' #rune #reading').html(PinyinConverter.toTone(PromptRuneView.vocab[0].get('reading')));
	    $(this.$el.selector + ' #rune #definition').html(PromptRuneView.vocab[0].get('definitions').en);
	    $(this.$el.selector + ' #rune #sentence').html(Skritter.fn.maskText(PromptRuneView.sentence, PromptRuneView.vocab[0].get('writing')));
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
		
	show: function(grade) {
	    //stops the time
	    Skritter.timer.stop();
    
	    //display the grading buttons
	    PromptRuneView.gradingButtons.setElement($(this.$el.selector + ' #rune #grading-buttons')).render();
	    PromptRuneView.gradingButtons.select(grade);
	    
	    //display the new writing position display
	    PromptRuneView.position++;
	    $(this.$el.selector + ' #rune #writing').html(PromptRuneView.vocab[0].getWritingDisplayAt(PromptRuneView.position));
	    
	    //show the hidden sentence vocabs only if the last position of the prompt
	    if (PromptRuneView.position >= PromptRuneView.vocab[0].getCharacterCount())
		$(this.$el.selector + ' #rune #sentence').html(PromptRuneView.sentence);
	    
	    //events
	    this.listenToOnce(PromptRuneView.gradingButtons, 'selected', this.handleGradeSelected);
	},
		
	triggerComplete: function() {
	    console.log('prompt complete');
	    this.trigger('complete', PromptRuneView.grade);
	}
	
    });

    return PromptRuneView;
});