/*
 * 
 * Module: PromptTone
 * 
 * Created By: Joshua McFarland
 * 
 */
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
    'require.text!template/prompt/tone.html',
    'jquery.hammer',
    'backbone'
], function(PinyinConverter, CanvasView, GradingButtonsView, templateTone) {
    var Skritter = window.skritter;
    
    var PromptToneView = Backbone.View.extend({
	
	initialize: function() {
	    PromptToneView.canvas;
	    PromptToneView.complete = false;
	    PromptToneView.defintion;
	    PromptToneView.grade = 3;
	    PromptToneView.gradingButtons = new GradingButtonsView();
	    PromptToneView.position;
	    PromptToneView.reading;
	    PromptToneView.sentence;
	    PromptToneView.vocab;
	    PromptToneView.writing;
	},
	
	template: _.template(templateTone),
	
	render: function() {
	    this.$el.html(this.template);
	    
	    if (PromptToneView.writing)
		$(this.$el.selector + ' #tone #writing').html(PromptToneView.writing);
	    if (PromptToneView.reading)
		$(this.$el.selector + ' #tone #reading').html(PromptToneView.reading);
	    if (PromptToneView.definition)
		$(this.$el.selector + ' #tone #definition').html(PromptToneView.definition);
	    if (PromptToneView.canvas)
		$(this.$el.selector + ' #tone #sentence').html(Skritter.fn.maskText(PromptToneView.sentence, PromptToneView.vocab[0].get('writing')));
	    if (PromptToneView.canvas)
		PromptToneView.canvas.setElement($(this.$el.selector + ' #tone #canvas-area')).render();
	    if (PromptToneView.complete) {
		PromptToneView.canvas.disable();
		this.toggleGradingButtons();
	    }
	    
	    Skritter.frame.study();
	    return this;
	},
	
	handleGradeSelected: function() {
	    this.triggerComplete();
	},
	
	handleWritingComplete: function(grade) {
	    PromptToneView.canvas.disable();
	    PromptToneView.complete = true;
	    PromptToneView.grade = grade;
	    $(this.$el.selector + ' #tone #canvas-area').hammer().one('swipeleft.PromptToneView', _.bind(this.triggerComplete, this));
	    $(this.$el.selector + ' #tone #canvas-area').hammer().one('tap.PromptToneView', _.bind(this.triggerComplete, this));
	    this.show();
	    this.toggleGradingButtons();
	},
		
	set: function(vocab, position) {
	    Skritter.timer.setReviewLimit(15000);
	    Skritter.timer.setThinkingLimit(10000);
	    Skritter.timer.start();
    
	    PromptToneView.vocab = vocab;
	    PromptToneView.position = position;
	    
	    //set prompt variables
	    PromptToneView.defintion = PromptToneView.vocab[0].get('definitions').en;
	    PromptToneView.reading = PinyinConverter.toTone(PromptToneView.vocab[0].getReadingDisplayAt(PromptToneView.position));
	    PromptToneView.writing = PromptToneView.vocab[0].get('writing');
	    //set the sentence only if one exists
	    if (Skritter.studySentences.findWhere({id:PromptToneView.vocab[0].get('sentenceId')}).get('writing'));
		PromptToneView.sentence = Skritter.studySentences.findWhere({id:PromptToneView.vocab[0].get('sentenceId')}).get('writing');
		
	    $(this.$el.selector + ' #tone #writing').html(PromptToneView.writing);
	    $(this.$el.selector + ' #tone #reading').html(PromptToneView.reading);
	    $(this.$el.selector + ' #tone #definition').html(PromptToneView.defintion);
	    $(this.$el.selector + ' #tone #sentence').html(PromptToneView.sentence, PromptToneView.vocab[0].get('writing'));
	    PromptToneView.canvas = new CanvasView();
	    PromptToneView.canvas.setElement($(this.$el.selector + ' #tone #canvas-area')).render();
	    PromptToneView.canvas.drawBackground(PromptToneView.vocab[0].getCanvasCharacters(PromptToneView.position)[0].getCharacterContainer(), 0.5);
	    PromptToneView.canvas.setTargets(PromptToneView.vocab[0].getCanvasTones(PromptToneView.position));
	    
	    //events
	    self = this;
	    this.listenToOnce(PromptToneView.canvas, 'complete:character', this.handleWritingComplete);
	    $(this.$el.selector + ' #tone #canvas-area').hammer().on('doubletap', function() {
		PromptToneView.canvas.showTarget(0.2);
	    });
	},
		
	show: function(grade) {
	    
    
	    //display the new reading position display
	    PromptToneView.position++;
	    $(this.$el.selector + ' #tone #reading').html(PinyinConverter.toTone(PromptToneView.vocab[0].getReadingDisplayAt(PromptToneView.position)));
	    
	    //events
	    this.listenToOnce(PromptToneView.gradingButtons, 'selected', this.handleGradeSelected);
	},
		
	toggleGradingButtons: function() {
	    //display the grading buttons
	    PromptToneView.gradingButtons.setElement($(this.$el.selector + ' #tone #grading-buttons')).render();
	    PromptToneView.gradingButtons.select(PromptToneView.grade);
	},
		
	triggerComplete: function() {
	    this.trigger('complete', PromptToneView.grade);
	}
	
    });

    return PromptToneView;
});