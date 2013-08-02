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
	    PromptToneView.canvas = new CanvasView();
	    PromptToneView.grade = 3;
	    PromptToneView.gradingButtons = new GradingButtonsView();
	    PromptToneView.position;
	    PromptToneView.vocab;
	},
	
	template: _.template(templateTone),
	
	render: function() {
	    this.$el.html(this.template);
	    Skritter.frame.study();
	    return this;
	},
	
	handleGradeSelected: function(grade) {
	    PromptToneView.grade = grade;
	    this.triggerComplete();
	},
	
	handleWritingComplete: function(grade) {
	    PromptToneView.canvas.disable();
	    $(this.$el.selector + ' #tone #canvas-prompt').hammer().one('swipeleft.PromptToneView', _.bind(this.triggerComplete, this));
	    $(this.$el.selector + ' #tone #canvas-prompt').hammer().one('tap.PromptToneView', _.bind(this.triggerComplete, this));
	    this.show(grade);
	},
		
	set: function(vocab, position) {
	    PromptToneView.vocab = vocab;
	    PromptToneView.position = position;
	    $(this.$el.selector + ' #tone #writing').html(PromptToneView.vocab[0].get('writing'));
	    $(this.$el.selector + ' #tone #reading').html(PinyinConverter.toTone(PromptToneView.vocab[0].getReadingDisplayAt(PromptToneView.position)));
	    $(this.$el.selector + ' #tone #definition').html(PromptToneView.vocab[0].get('definitions').en);
	    PromptToneView.canvas.setElement($(this.$el.selector + ' #tone #canvas-area')).render();
	    PromptToneView.canvas.setTargets(PromptToneView.vocab[0].getCanvasTones(PromptToneView.position));
	    
	    //events
	    self = this;
	    this.listenToOnce(PromptToneView.canvas, 'complete:character', this.handleWritingComplete);
	    $(this.$el.selector + ' #tone #canvas-area').hammer().on('doubletap', function() {
		PromptToneView.canvas.showTarget(0.2);
	    });
	},
		
	show: function(grade) {
	    //display the grading buttons
	    PromptToneView.gradingButtons.setElement($(this.$el.selector + ' #tone #grading-buttons')).render();
	    PromptToneView.gradingButtons.select(grade);
	    
	    //display the new reading position display
	    PromptToneView.position++;
	    $(this.$el.selector + ' #tone #reading').html(PinyinConverter.toTone(PromptToneView.vocab[0].getReadingDisplayAt(PromptToneView.position)));
	    
	    //events
	    this.listenToOnce(PromptToneView.gradingButtons, 'selected', this.handleGradeSelected);
	},
		
	triggerComplete: function() {
	    this.trigger('complete', PromptToneView.grade);
	}
	
    });

    return PromptToneView;
});